import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { EditableField } from '../ui/editable-field';

interface LOITrackerProps {
  submitted: boolean;
  description: string;
  weeklyCount: number;
  onUpdate: (data: { submitted: boolean; description: string }) => void;
}

export const LOITracker = ({ submitted, description, weeklyCount, onUpdate }: LOITrackerProps) => {
  const handleSubmittedToggle = (checked: boolean) => {
    onUpdate({ submitted: checked, description });
  };

  const handleDescriptionChange = (value: string | number) => {
    const stringValue = typeof value === 'string' ? value : value.toString();
    onUpdate({ submitted, description: stringValue });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="loi-submitted" className="activity-label text-sm font-medium text-foreground">Letter of Intent submitted</Label>
        <Switch
          id="loi-submitted"
          checked={submitted}
          onCheckedChange={handleSubmittedToggle}
        />
      </div>

      <EditableField
        label="LOI details (optional)"
        value={description || ""}
        type="textarea"
        placeholder="Describe your offer or opportunity..."
        onSave={handleDescriptionChange}
        rows={3}
      />

      <div className={`text-sm ${weeklyCount >= 7 ? 'text-green-600' : 'text-orange-600'}`}>
        Weekly progress: {weeklyCount}/7 LOIs submitted
        {weeklyCount >= 7 && ' ✅ Weekly target achieved!'}
      </div>
    </div>
  );
};