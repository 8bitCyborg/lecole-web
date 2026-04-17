import { useState, useRef, useEffect, useMemo } from 'react';
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
import { addDays, format, getDate, eachDayOfInterval, parseISO, differenceInDays } from 'date-fns';
import { useGetStudentsByArmQuery } from '@/services/leApi/armsApi';
import { useGetAttendanceQuery, useMarkAttendanceMutation } from '@/services/leApi/attendanceApi';
import { useFindMySchoolQuery } from '@/services/leApi/schoolApi';
import { useGetCurrentSessionQuery } from '@/services/leApi/sessionApi';
import LeDropdown from '@/components/ui/LeDropdown/LeDropdown';
import AttendanceWeekPicker from './AttendanceWeekPicker';
import "./style.css";


type AttendanceStatus = 'Present' | 'Absent' | '-';

const AttendanceSheet = ({ classId, armId }: { classId: string, armId: string }) => {
  const school = useFindMySchoolQuery();
  const schoolData = school.currentData;
  const term = schoolData?.currentTermId;
  const session = schoolData?.currentSessionId;

  const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsByArmQuery(armId!);

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: sessionData } = useGetCurrentSessionQuery(undefined, { skip: !session });
  const currentTerm = useMemo(() => sessionData?.terms?.find(t => t.id === term), [sessionData, term]);

  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  // Initialize selectedWeek/currentWeek logic
  useEffect(() => {
    if (currentTerm?.startDate) {
      const today = new Date();
      const start = parseISO(currentTerm.startDate);
      const diffDays = differenceInDays(today, start);

      let week = Math.floor(diffDays / 7) + 1;

      // Handle scenarios where the current date is before the Term start date (default to Week 1)
      if (diffDays < 0) week = 1;

      // or after the Term end date (default to the final week)
      if (currentTerm.numberOfWeeks && week > currentTerm.numberOfWeeks) {
        week = currentTerm.numberOfWeeks;
      }

      setSelectedWeek(week);
    }
  }, [currentTerm]);

  const actualCurrentWeek = useMemo(() => {
    if (!currentTerm?.startDate) return 1;
    const today = new Date();
    const start = parseISO(currentTerm.startDate);
    const diffDays = differenceInDays(today, start);

    let week = Math.floor(diffDays / 7) + 1;
    if (diffDays < 0) week = 1;
    if (currentTerm.numberOfWeeks && week > currentTerm.numberOfWeeks) {
      week = currentTerm.numberOfWeeks;
    }
    return week;
  }, [currentTerm]);

  const isCurrentWeekSelected = selectedWeek === actualCurrentWeek;

  // Auto-exit editing mode when navigating away from current week
  useEffect(() => {
    if (!isCurrentWeekSelected) {
      setIsEditing(false);
    }
  }, [isCurrentWeekSelected]);

  const { startDate, endDate } = useMemo(() => {
    if (!currentTerm?.startDate) return { startDate: '', endDate: '' };

    const baseDate = parseISO(currentTerm.startDate);
    const monday = addDays(baseDate, (selectedWeek - 1) * 7);
    const friday = addDays(monday, 4);

    return {
      startDate: format(monday, 'yyyy-MM-dd'),
      endDate: format(friday, 'yyyy-MM-dd'),
    };
  }, [currentTerm, selectedWeek]);

  const maxAllowedWeek = useMemo(() => {
    if (!currentTerm?.startDate) return 1;
    const today = new Date();
    const start = parseISO(currentTerm.startDate);
    const diffDays = differenceInDays(today, start);
    if (diffDays < 0) return 1;

    let mWeek = Math.floor(diffDays / 7) + 1;
    if (currentTerm.numberOfWeeks && mWeek > currentTerm.numberOfWeeks) {
      return currentTerm.numberOfWeeks;
    }
    return mWeek;
  }, [currentTerm]);

  const currentWeekDays = useMemo(() => {
    try {
      if (!startDate || !endDate) return [];
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      if (start > end) return [];

      const days = eachDayOfInterval({ start, end });
      return days.map(date => ({
        label: format(date, 'EEEE'),
        dateString: format(date, 'yyyy-MM-dd'),
        dayNumber: getDate(date),
        displayFormat: format(date, 'd/M/yyyy'),
      }));
    } catch {
      return [];
    }
  }, [startDate, endDate]);

  const { data: attendanceRecords = {}, isLoading: isLoadingAttendance } = useGetAttendanceQuery(
    { classId, armId, term: term!, session: session!, startDate, endDate },
    { skip: !term || !session || !startDate || !endDate || !schoolData?.id }
  );

  const [markAttendance, { isLoading: isSaving, isSuccess }] = useMarkAttendanceMutation();

  const attendanceMap = useMemo(() => {
    const map: Record<string, AttendanceStatus> = {};
    if (attendanceRecords) {
      Object.keys(attendanceRecords).forEach(dateKey => {
        const recordsForDay = attendanceRecords[dateKey];
        if (Array.isArray(recordsForDay)) {
          recordsForDay.forEach(record => {
            if (!record.date) return;
            const dateStr = record.date.split('T')[0];
            const statusStr = record.status === 'PRESENT' ? 'Present' : record.status === 'ABSENT' ? 'Absent' : '-';
            map[`${record.studentId}|${dateStr}`] = statusStr as AttendanceStatus;
          });
        }
      });
    }
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
    if (!isCurrentWeekSelected) return;
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

            {!isEditing && currentTerm && (
              <AttendanceWeekPicker
                selectedWeek={selectedWeek}
                onWeekChange={setSelectedWeek}
                startDate={currentTerm.startDate}
                numberOfWeeks={currentTerm.numberOfWeeks || 13}
                maxAllowedWeek={maxAllowedWeek}
              />
            )}
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

            {!isSaving && isCurrentWeekSelected && (
              <button
                className={`toolbar-btn icon-only ${isSaving ? 'disabled' : ''}`}
                onClick={handleToggleEdit}
                disabled={isSaving}
                title={isEditing ? 'Exit Edit Mode' : 'Edit Attendance'}
              >
                {isEditing ? <XCircle size={16} /> : <Edit2 size={16} />}
              </button>
            )}

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
                  <th className="total-header">Days Present This week</th>
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
                        const canEdit = isEditing && isCurrentWeekSelected;

                        return (
                          <td key={day.dateString} className={`attendance-cell ${canEdit ? 'editing' : ''}`}>
                            {canEdit ? (
                              <LeDropdown
                                label=""
                                placeholder="Mark Student"
                                className="attendance-le-dropdown"
                                direction="down"
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