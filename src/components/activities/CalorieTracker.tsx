import { useState, useEffect } from 'react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { EditableField } from '../ui/editable-field';
import { useHealthKit } from '../../hooks/useHealthKit';
import { Heart, Zap, TrendingUp } from 'lucide-react';

interface CalorieTrackerProps {
  target: number;
  achieved: boolean;
  onTargetUpdate: (target: number) => void;
  onAchievedUpdate: (achieved: boolean) => void;
}

export const CalorieTracker = ({ target, achieved, onTargetUpdate, onAchievedUpdate }: CalorieTrackerProps) => {
  const { healthData, isAvailable, requestPermissions, fetchTodaysHealthData, getCalorieGoal, permissions } = useHealthKit();
  const [showHealthData, setShowHealthData] = useState(false);

  const handleTargetChange = (value: string | number) => {
    const numValue = typeof value === 'number' ? value : (parseInt(value) || 0);
    onTargetUpdate(numValue);
  };

  const handleAchievedToggle = (checked: boolean) => {
    onAchievedUpdate(checked);
  };

  const handleSyncWithHealth = async () => {
    if (!permissions.calories) {
      const granted = await requestPermissions();
      if (!granted) return;
    }
    
    const success = await fetchTodaysHealthData();
    if (success) {
      setShowHealthData(true);
      // Auto-update target based on health data
      const suggestedTarget = getCalorieGoal();
      if (suggestedTarget !== target) {
        onTargetUpdate(suggestedTarget);
      }
    }
  };

  return (
    <div className="space-y-4">
      <EditableField
        label="Daily Calorie Target"
        value={target}
        suffix=" Cal"
        type="number"
        placeholder="Enter calorie target"
        onSave={handleTargetChange}
      />

      {/* Apple Health Integration */}
      {isAvailable && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="activity-label text-xs font-medium text-muted-foreground uppercase tracking-wide">Sync with Apple Health</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncWithHealth}
              className="h-8 px-3"
            >
              <Heart className="h-3 w-3 mr-1" />
              Sync
            </Button>
          </div>

          {showHealthData && healthData?.calories && (
            <div className="bg-muted/30 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Calories Burned</span>
                </div>
                <span className="text-sm font-medium">{healthData.calories.burned}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Calories Consumed</span>
                </div>
                <span className="text-sm font-medium">{healthData.calories.consumed}</span>
              </div>
              
              <div className="text-xs text-muted-foreground pt-1 border-t">
                Suggested target: {getCalorieGoal()} Cal (based on your activity)
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <Label htmlFor="calorie-achieved" className="activity-label text-sm font-medium text-foreground">Target achieved today</Label>
        <Switch
          id="calorie-achieved"
          checked={achieved}
          onCheckedChange={handleAchievedToggle}
        />
      </div>
    </div>
  );
};