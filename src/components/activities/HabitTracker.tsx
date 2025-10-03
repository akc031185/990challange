import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { EditableField } from '../ui/editable-field';

interface HabitTrackerProps {
  habitDescription: string;
  completed: boolean;
  onHabitUpdate: (habitDescription: string) => void;
  onCompletedUpdate: (completed: boolean) => void;
}

export const HabitTracker = ({ habitDescription = '', completed, onHabitUpdate, onCompletedUpdate }: HabitTrackerProps) => {
  const handleHabitChange = (value: string | number) => {
    const stringValue = typeof value === 'string' ? value : value.toString();
    onHabitUpdate(stringValue);
  };

  const handleCompletedToggle = (checked: boolean) => {
    onCompletedUpdate(checked);
  };

  const hasHabit = habitDescription && habitDescription.trim() !== '';

  return (
    <div className="space-y-4">
      <EditableField
        label="Daily Habit Goal"
        value={habitDescription || ""}
        type="text"
        placeholder="e.g., Read 10 pages daily, No processed sugar today, Exercise 30 mins"
        onSave={handleHabitChange}
      />

      {hasHabit && (
        <div className="flex items-center justify-between">
          <Label htmlFor="habit-completed" className="activity-label text-sm font-medium text-foreground">Worked on this habit today</Label>
          <Switch
            id="habit-completed"
            checked={completed}
            onCheckedChange={handleCompletedToggle}
          />
        </div>
      )}

      <div className="activity-description text-xs text-muted-foreground">
        {!hasHabit 
          ? "💡 Set a habit goal to track daily progress (adding good habits or removing bad ones)"
          : completed 
            ? "✅ Great job working on your habit today!" 
            : "Toggle when you've worked on your habit today"
        }
      </div>
    </div>
  );
};