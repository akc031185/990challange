import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useChallenge } from '../hooks/useChallenge';

interface ChallengeCalendarProps {
  onDateSelect: (date: string) => void;
}

export const ChallengeCalendar = ({ onDateSelect }: ChallengeCalendarProps) => {
  const { challengeData } = useChallenge();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Create calendar grid
    const days: (number | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return {
      year,
      month,
      days,
      monthName: firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
  }, [currentMonth]);

  const getDayStatus = (day: number | null) => {
    if (day === null) return null;

    const dateStr = `${monthData.year}-${String(monthData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = challengeData.dailyData[dateStr];

    if (!dayData) return 'empty';

    // Count completed activities
    let count = 0;
    if (dayData.calories?.achieved) count++;
    if (dayData.workout?.completed) count++;
    if (dayData.sleep?.hours >= 6 && dayData.sleep?.hours <= 7) count++;
    if (dayData.habit?.completed) count++;
    if (dayData.loi?.submitted) count++;
    if (dayData.gratitude?.people?.length >= 2) count++;
    if (dayData.connection?.made) count++;
    if (dayData.posts?.reel?.completed && dayData.posts?.story?.completed) count++;

    if (count === 9) return 'perfect'; // All activities completed
    if (count >= 5) return 'good'; // Most activities
    if (count > 0) return 'partial'; // Some activities
    return 'empty';
  };

  const handleDayClick = (day: number | null) => {
    if (day === null) return;

    const dateStr = `${monthData.year}-${String(monthData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    // Only allow selecting today or past dates
    if (dateStr <= today) {
      onDateSelect(dateStr);
    }
  };

  const isToday = (day: number | null) => {
    if (day === null) return false;
    const dateStr = `${monthData.year}-${String(monthData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const isFutureDate = (day: number | null) => {
    if (day === null) return false;
    const dateStr = `${monthData.year}-${String(monthData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    return dateStr > today;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'perfect': return 'bg-green-600 text-white';
      case 'good': return 'bg-blue-500 text-white';
      case 'partial': return 'bg-orange-500 text-white';
      case 'empty': return 'bg-muted text-muted-foreground';
      default: return 'bg-transparent';
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Challenge Progress
        </CardTitle>
        <Button onClick={goToToday} size="sm" variant="ghost" className="text-xs">
          Today
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between">
          <Button onClick={previousMonth} size="sm" variant="ghost">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-sm font-semibold text-foreground">{monthData.monthName}</h3>
          <Button onClick={nextMonth} size="sm" variant="ghost">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {monthData.days.map((day, index) => {
            const status = getDayStatus(day);
            const today = isToday(day);
            const future = isFutureDate(day);

            return (
              <button
                key={index}
                onClick={() => handleDayClick(day)}
                disabled={day === null || future}
                className={`
                  aspect-square rounded-md text-xs font-medium transition-all
                  ${day === null ? 'invisible' : ''}
                  ${future ? 'opacity-30 cursor-not-allowed' : 'hover:ring-2 hover:ring-primary cursor-pointer'}
                  ${today ? 'ring-2 ring-primary' : ''}
                  ${getStatusColor(status)}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-xs">
            <div className="w-3 h-3 rounded bg-green-600"></div>
            <span className="text-muted-foreground">Perfect (9/9)</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-muted-foreground">Good (5-8)</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <div className="w-3 h-3 rounded bg-orange-500"></div>
            <span className="text-muted-foreground">Partial (1-4)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
