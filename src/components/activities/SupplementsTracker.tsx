import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Plus, X } from 'lucide-react';

interface SupplementsTrackerProps {
  list: string[];
  taken: boolean;
  onUpdate: (data: { list: string[]; taken: boolean }) => void;
}

export const SupplementsTracker = ({ list, taken, onUpdate }: SupplementsTrackerProps) => {
  const [newSupplement, setNewSupplement] = useState('');
  const [supplements, setSupplements] = useState(list);
  const [showInput, setShowInput] = useState(list.length === 0);

  useEffect(() => {
    setSupplements(list);
    setShowInput(list.length === 0);
  }, [list]);

  const addSupplement = () => {
    if (newSupplement.trim() && !supplements.includes(newSupplement.trim())) {
      const updatedList = [...supplements, newSupplement.trim()];
      setSupplements(updatedList);
      onUpdate({ list: updatedList, taken });
      setNewSupplement('');
      setShowInput(false);
    }
  };

  const removeSupplement = (supplement: string) => {
    const updatedList = supplements.filter(s => s !== supplement);
    setSupplements(updatedList);
    onUpdate({ list: updatedList, taken });
  };

  const handleTakenToggle = (checked: boolean) => {
    onUpdate({ list: supplements, taken: checked });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="activity-label text-sm font-medium text-foreground">Your Supplements/Vitamins</Label>

        {supplements.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {supplements.map((supplement) => (
                <Badge key={supplement} variant="secondary" className="flex items-center gap-1">
                  {supplement}
                  <button
                    onClick={() => removeSupplement(supplement)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {showInput ? (
          <div className="flex gap-2">
            <Input
              placeholder="Add supplement..."
              value={newSupplement}
              onChange={(e) => setNewSupplement(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSupplement()}
            />
            <Button onClick={addSupplement} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="text-primary text-sm hover:underline flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add more supplements
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="supplements-taken" className="activity-label text-sm font-medium text-foreground">Taken today</Label>
        <Switch
          id="supplements-taken"
          checked={taken}
          onCheckedChange={handleTakenToggle}
        />
      </div>
    </div>
  );
};