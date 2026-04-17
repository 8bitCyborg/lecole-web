import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LeDropdown from '@/components/ui/LeDropdown/LeDropdown';

interface AttendanceWeekPickerProps {
  selectedWeek: number;
  onWeekChange: (week: number) => void;
  startDate: string;
  numberOfWeeks: number;
  maxAllowedWeek: number;
}

const AttendanceWeekPicker = ({
  selectedWeek,
  onWeekChange,
  startDate,
  numberOfWeeks,
  maxAllowedWeek,
}: AttendanceWeekPickerProps) => {
  const weeks = useMemo(() => {
    const options = [];
    
    for (let i = 1; i <= numberOfWeeks; i++) {
      if (i > maxAllowedWeek) break;
      
      options.push({ 
        value: i.toString(), 
        label: `Week ${i}`, 
        disabled: false 
      });
    }
    return options;
  }, [startDate, numberOfWeeks, maxAllowedWeek]);

  const handlePrev = () => {
    if (selectedWeek > 1) {
      onWeekChange(selectedWeek - 1);
    }
  };

  const handleNext = () => {
    if (selectedWeek < numberOfWeeks && selectedWeek < maxAllowedWeek) {
      onWeekChange(selectedWeek + 1);
    }
  };

  return (
    <div className="week-picker-container">
      <button
        className="toolbar-btn icon-only"
        onClick={handlePrev}
        disabled={selectedWeek <= 1}
        title="Previous Week"
      >
        <ChevronLeft size={16} />
      </button>

      <LeDropdown
        label=""
        value={selectedWeek.toString()}
        onChange={(e) => onWeekChange(Number(e.target.value))}
        options={weeks}
        className="attendance-week-dropdown"
        placeholder="Select Week"
      />

      <button
        className="toolbar-btn icon-only"
        onClick={handleNext}
        disabled={selectedWeek >= numberOfWeeks || selectedWeek >= maxAllowedWeek}
        title="Next Week"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default AttendanceWeekPicker;
