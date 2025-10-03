import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { EditableField } from '../ui/editable-field';

interface WorkoutTrackerProps {
  completed: boolean;
  description: string;
  onUpdate: (data: { completed: boolean; description: string }) => void;
}

export const WorkoutTracker = ({ completed, description, onUpdate }: WorkoutTrackerProps) => {
  const handleCompletedToggle = (checked: boolean) => {
    onUpdate({ completed: checked, description });
  };

  const handleDescriptionChange = (value: string | number) => {
    const stringValue = typeof value === 'string' ? value : value.toString();
    onUpdate({ completed, description: stringValue });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="workout-completed" className="activity-label text-sm font-medium text-foreground">Workout completed</Label>
        <Switch
          id="workout-completed"
          checked={completed}
          onCheckedChange={handleCompletedToggle}
        />
      </div>
      
      <EditableField
        label="Workout details (optional)"
        value={description || ""}
        type="textarea"
        placeholder="Describe your workout..."
        onSave={handleDescriptionChange}
        rows={3}
      />
    </div>
  );
};