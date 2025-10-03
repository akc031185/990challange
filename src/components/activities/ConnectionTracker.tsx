import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { EditableField } from '../ui/editable-field';

interface ConnectionTrackerProps {
  made: boolean;
  name: string;
  onUpdate: (data: { made: boolean; name: string }) => void;
}

export const ConnectionTracker = ({ made, name, onUpdate }: ConnectionTrackerProps) => {
  const handleMadeToggle = (checked: boolean) => {
    onUpdate({ made: checked, name });
  };

  const handleNameChange = (value: string | number) => {
    const stringValue = typeof value === 'string' ? value : value.toString();
    onUpdate({ made, name: stringValue });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="connection-made" className="activity-label text-sm font-medium text-foreground">New professional connection made</Label>
        <Switch
          id="connection-made"
          checked={made}
          onCheckedChange={handleMadeToggle}
        />
      </div>
      
      <EditableField
        label="Connection name"
        value={name || ""}
        type="text"
        placeholder="Enter person's name..."
        onSave={handleNameChange}
      />
    </div>
  );
};