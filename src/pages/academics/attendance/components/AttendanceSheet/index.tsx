import { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Save,
  Loader2,
  XCircle,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { startOfWeek, addDays, format, getDate } from 'date-fns';
import { useGetStudentsByArmQuery } from '@/services/leApi/armsApi';
import { useGetAttendanceQuery, useMarkAttendanceMutation } from '@/services/leApi/attendanceApi';
import LeDropdown from '@/components/ui/LeDropdown/LeDropdown';
import "./style.css";


type AttendanceStatus = 'Present' | 'Absent' | '-';

const AttendanceSheet = ({ classId, armId }: { classId: string, armId: string }) => {
  const school = useSelector((state: any) => state.school.school);
  const term = school?.currentTerm;
  const session = school?.currentSession;

  const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsByArmQuery(armId!);

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentWeekDays = useMemo(() => {
    const today = new Date();
    const monday = startOfWeek(today, { weekStartsOn: 1 });

    return Array.from({ length: 5 }).map((_, i) => {
      const date = addDays(monday, i);
      return {
        label: format(date, 'EEEE'),
        dateString: format(date, 'yyyy-MM-dd'),
        dayNumber: getDate(date),
        displayFormat: format(date, 'd/M/yyyy'),
      };
    });
  }, []);

  const startDate = currentWeekDays[0]?.dateString;
  const endDate = currentWeekDays[currentWeekDays.length - 1]?.dateString;

  const { data: attendanceRecords = [], isLoading: isLoadingAttendance } = useGetAttendanceQuery(
    { classId, armId, term, session, startDate, endDate },
    { skip: !term || !session || !startDate || !endDate }
  );

  const [markAttendance, { isLoading: isSaving, isSuccess }] = useMarkAttendanceMutation();

  const attendanceMap = useMemo(() => {
    const map: Record<string, AttendanceStatus> = {};
    attendanceRecords.forEach(record => {
      if (!record.date) return;
      const dateStr = record.date.split('T')[0];
      const statusStr = record.status === 'PRESENT' ? 'Present' : record.status === 'ABSENT' ? 'Absent' : '-';
      map[`${record.studentId}|${dateStr}`] = statusStr as AttendanceStatus;
    });
    return map;
  }, [attendanceRecords]);

  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Local state for pending changes: `${studentId}|${day}` -> status
  const [pendingChanges, setPendingChanges] = useState<Record<string, AttendanceStatus>>({});

  const hasUnsavedChanges = Object.keys(pendingChanges).length > 0;

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowScrollLeft(scrollLeft > 10);
      setShowScrollRight(scrollWidth > clientWidth && scrollLeft < (scrollWidth - clientWidth - 10));
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const targetScroll = direction === 'left'
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [students]);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleStatusChange = (studentId: string, dateString: string, status: AttendanceStatus) => {
    const key = `${studentId}|${dateString}`;
    setPendingChanges(prev => ({
      ...prev,
      [key]: status
    }));
  };

  useEffect(() => {
    if (isSuccess) {
      setPendingChanges({});
      setIsEditing(false);
    }
  }, [isSuccess]);

  const handleSave = async () => {
    try {
      const changesByDate: Record<string, { studentId: string; status: string }[]> = {};
      Object.entries(pendingChanges).forEach(([key, status]) => {
        const [studentId, dateString] = key.split('|');
        if (!changesByDate[dateString]) changesByDate[dateString] = [];
        changesByDate[dateString].push({
          studentId,
          status: status === 'Present' ? 'PRESENT' : 'ABSENT'
        });
      });

      const promises = Object.entries(changesByDate).map(([dateString, records]) =>
        markAttendance({ classId, armId, date: dateString, records }).unwrap()
      );

      await Promise.all(promises);
    } catch (err) {
      console.error('Failed to save attendance', err);
    }
  };

  const getStatusValue = (studentId: string, dateString: string): AttendanceStatus => {
    const key = `${studentId}|${dateString}`;
    if (pendingChanges[key] !== undefined) {
      return pendingChanges[key];
    }
    if (attendanceMap[key] !== undefined) {
      return attendanceMap[key];
    }
    return '-';
  };

  const getStatusDisplay = (status: AttendanceStatus) => {
    if (status === 'Present') return <span className="status-pill present">P</span>;
    if (status === 'Absent') return <span className="status-pill absent">A</span>;
    // if (status === 'Late') return <span className="status-pill late">L</span>;
    return <span className="status-pill empty">-</span>;
  };

  if (isLoadingStudents || isLoadingAttendance) {
    return (
      <div className="attendance-empty-state" style={{ background: 'white' }}>
        <div className="loading-dense">Synchronizing attendance data...</div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="attendance-empty-state" style={{ background: 'white', borderTopLeftRadius: 0 }}>
        <div className="empty-state-icon">📋</div>
        <h3 className="empty-state-title">No Students Enrolled</h3>
        <p className="empty-state-description">
          There are no students in this arm to mark attendance for.
        </p>
      </div>
    );
  }

  return (
    <>
      {isFullScreen && <div className="fullscreen-backdrop" onClick={() => setIsFullScreen(false)} />}
      <div className={`attendance-wrapper ${isFullScreen ? 'full-screen' : ''}`}>

        {/* ── Toolbar ── */}
        <div className="attendance-toolbar">
          <div className="attendance-toolbar-left">
            <span className="attendance-toolbar-title">
              {isEditing ? (
                hasUnsavedChanges
                  ? <span className="toolbar-badge unsaved">● Unsaved changes</span>
                  : <span className="toolbar-badge editing">Editing</span>
              ) : (
                <span className="toolbar-badge">Weekly Sheet</span>
              )}
            </span>
          </div>

          <div className="attendance-toolbar-right">
            {showScrollLeft && (
              <button
                className="toolbar-btn icon-only"
                onClick={() => handleScroll('left')}
                title="Scroll Left"
              >
                <ChevronLeft size={16} />
              </button>
            )}

            {showScrollRight && (
              <button
                className="toolbar-btn"
                onClick={() => handleScroll('right')}
                title="Scroll Right"
              >
                <ChevronRight size={16} />
              </button>
            )}

            {isEditing && hasUnsavedChanges && (
              <button
                className="toolbar-btn save"
                onClick={handleSave}
                disabled={isSaving}
                title="Save Changes"
              >
                {isSaving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
                <span>{isSaving ? 'Saving…' : 'Save'}</span>
              </button>
            )}

            <button
              className={`toolbar-btn icon-only ${isSaving ? 'disabled' : ''}`}
              onClick={handleToggleEdit}
              disabled={isSaving}
              title={isEditing ? 'Exit Edit Mode' : 'Edit Attendance'}
            >
              {isEditing ? <XCircle size={16} /> : <Edit2 size={16} />}
            </button>

            <button
              className="toolbar-btn icon-only"
              onClick={() => setIsFullScreen(!isFullScreen)}
              title={isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            >
              {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="attendance-container" ref={containerRef}>
          <div
            className="attendance-table-wrapper"
            ref={scrollRef}
            onScroll={checkScroll}
          >
            <table className="attendance-table">
              <thead>
                <tr>
                  <th className="sticky-col header-corner">Student Names</th>
                  {currentWeekDays.map(day => (
                    <th key={day.dateString} className="day-header">{day.label} <br />{day.displayFormat}</th>
                  ))}
                  <th className="total-header">Total Present This Week</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student: any) => {
                  let presents = 0;
                  currentWeekDays.forEach(day => {
                    if (getStatusValue(student.id, day.dateString) === 'Present') presents++;
                  });

                  return (
                    <tr key={student.id}>
                      <td className="sticky-col">
                        <div className="student-info-cell">
                          <span className="student-name-text">
                            {student.user.firstName} {student.user.lastName}
                          </span>
                        </div>
                      </td>
                      {currentWeekDays.map(day => {
                        const status = getStatusValue(student.id, day.dateString);
                        return (
                          <td key={day.dateString} className={`attendance-cell ${isEditing ? 'editing' : ''}`}>
                            {isEditing ? (
                              <LeDropdown
                                label=""
                                placeholder="Mark Student"
                                className="attendance-le-dropdown"
                                options={[
                                  { value: 'Present', label: 'Present' },
                                  { value: 'Absent', label: 'Absent' }
                                ]}
                                value={status !== '-' ? status : ''}
                                onChange={(e) => handleStatusChange(student.id, day.dateString, (e.target.value || '-') as AttendanceStatus)}
                              />
                            ) : (
                              getStatusDisplay(status)
                            )}
                          </td>
                        );
                      })}
                      <td className="total-cell">
                        <div className="total-display">{presents}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendanceSheet;