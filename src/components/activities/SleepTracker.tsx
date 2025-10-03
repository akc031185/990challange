import { useState } from 'react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { EditableField } from '../ui/editable-field';
import { useHealthKit } from '../../hooks/useHealthKit';
import { Heart, Moon, Clock } from 'lucide-react';

interface SleepTrackerProps {
  hours: number;
  onUpdate: (hours: number) => void;
}

export const SleepTracker = ({ hours, onUpdate }: SleepTrackerProps) => {
  const { healthData, isAvailable, requestPermissions, fetchTodaysHealthData, getSleepRecommendation, permissions } = useHealthKit();
  const [showHealthData, setShowHealthData] = useState(false);

  const handleHoursChange = (value: string | number) => {
    const numValue = typeof value === 'number' ? value : (parseFloat(value) || 0);
    onUpdate(numValue);
  };

  const handleSyncWithHealth = async () => {
    if (!permissions.sleep) {
      const granted = await requestPermissions();
      if (!granted) return;
    }
    
    const success = await fetchTodaysHealthData();
    if (success && healthData?.sleep) {
      setShowHealthData(true);
      // Auto-update sleep hours from health data
      const healthSleepHours = healthData.sleep.hours;
      if (Math.abs(healthSleepHours - hours) > 0.5) { // Only update if significantly different
        onUpdate(healthSleepHours);
      }
    }
  };

  const isOptimal = hours >= 6 && hours <= 7;

  return (
    <div className="space-y-4">
      <EditableField
        label="Hours of sleep (6-7 hrs target)"
        value={hours}
        suffix=" hrs"
        type="number"
        placeholder="Enter hours of sleep"
        onSave={handleHoursChange}
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

          {showHealthData && healthData?.sleep && (
            <div className="bg-muted/30 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium text-muted-foreground">Sleep Duration</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{healthData.sleep.hours.toFixed(1)} hrs</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="text-xs font-medium text-muted-foreground">Sleep Quality</span>
                </div>
                <span className="text-sm font-semibold text-foreground capitalize">{healthData.sleep.quality}</span>
              </div>
              
              <div className="activity-description text-xs text-muted-foreground pt-2 border-t">
                💡 {getSleepRecommendation()}
              </div>
            </div>
          )}
        </div>
      )}
      
      {hours > 0 && (
        <div className={`activity-description text-xs font-medium ${isOptimal ? 'text-green-600' : 'text-orange-600'}`}>
          {isOptimal 
            ? '✅ Optimal sleep range!' 
            : hours < 6 
              ? '⚠️ Try to get more sleep' 
              : '⚠️ Try to get less sleep for better quality'
          }
        </div>
      )}
    </div>
  );
};