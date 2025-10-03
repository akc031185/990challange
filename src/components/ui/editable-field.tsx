import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Label } from './label';
import { Edit3, Check, X } from 'lucide-react';

interface EditableFieldProps {
  label: string;
  value: string | number;
  suffix?: string;
  type?: 'text' | 'number' | 'textarea';
  placeholder?: string;
  onSave: (value: string | number) => void;
  rows?: number;
}

export const EditableField = ({ 
  label, 
  value, 
  suffix = '', 
  type = 'text', 
  placeholder,
  onSave,
  rows = 3
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  const handleEdit = () => {
    setEditValue(value.toString());
    setIsEditing(true);
  };

  const handleSave = () => {
    const finalValue = type === 'number' ? (parseInt(editValue) || 0) : editValue;
    onSave(finalValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Label className="activity-label">{label}</Label>
        <div className="flex items-center gap-2">
          {type === 'textarea' ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={rows}
              className="flex-1"
            />
          ) : (
            <Input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1"
            />
          )}
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleSave}
              className="h-8 w-8 p-0"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Label className="activity-label text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</Label>
        <div className="flex items-center gap-1 mt-1">
          <span className="activity-value text-sm font-medium text-foreground">
            {type === 'number' && value ? `${value}${suffix}` : value || ''}
          </span>
        </div>
      </div>
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={handleEdit}
        className="h-8 px-2 text-xs"
      >
        <Edit3 className="h-3 w-3 mr-1" />
        Edit
      </Button>
    </div>
  );
};