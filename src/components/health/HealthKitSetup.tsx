import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useHealthKit } from '../../hooks/useHealthKit';
import { Heart, Zap, Moon, Activity, Shield, CheckCircle } from 'lucide-react';

interface HealthKitSetupProps {
  onComplete: () => void;
}

export const HealthKitSetup = ({ onComplete }: HealthKitSetupProps) => {
  const { isAvailable, requestPermissions, permissions, loading } = useHealthKit();
  const [step, setStep] = useState<'intro' | 'permissions' | 'complete'>('intro');

  const handleRequestPermissions = async () => {
    setStep('permissions');
    const granted = await requestPermissions();
    if (granted) {
      setStep('complete');
    }
  };

  const healthFeatures = [
    {
      icon: <Zap className="h-5 w-5 text-orange-500" />,
      title: 'Calorie Tracking',
      description: 'Auto-sync calories burned and consumed from Apple Health',
      permission: 'calories'
    },
    {
      icon: <Moon className="h-5 w-5 text-blue-500" />,
      title: 'Sleep Monitoring',
      description: 'Import sleep duration and quality data automatically',
      permission: 'sleep'
    },
    {
      icon: <Heart className="h-5 w-5 text-red-500" />,
      title: 'Heart Rate',
      description: 'Track resting and active heart rate for fitness insights',
      permission: 'heartRate'
    },
    {
      icon: <Activity className="h-5 w-5 text-green-500" />,
      title: 'Activity Data',
      description: 'Monitor daily steps and movement patterns',
      permission: 'steps'
    }
  ];

  if (!isAvailable) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Health Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Apple Health integration is only available on iOS devices. You can still track your progress manually.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (step === 'intro') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>Connect Apple Health</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Automatically sync your health data to make tracking easier and more accurate.
          </p>

          <div className="space-y-3">
            {healthFeatures.map((feature) => (
              <div key={feature.permission} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/30">
                {feature.icon}
                <div className="flex-1">
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-blue-900">Privacy Protected</p>
              <p className="text-xs text-blue-700">
                Your health data stays on your device. We only read the data you authorize.
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleRequestPermissions} className="flex-1" disabled={loading}>
              {loading ? 'Setting up...' : 'Connect Apple Health'}
            </Button>
            <Button variant="outline" onClick={onComplete}>
              Skip
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'permissions') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>Requesting Permissions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please allow access to the health data categories you'd like to sync.
          </p>

          <div className="space-y-2">
            {healthFeatures.map((feature) => (
              <div key={feature.permission} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  {feature.icon}
                  <span className="text-sm">{feature.title}</span>
                </div>
                <Badge variant={permissions[feature.permission as keyof typeof permissions] ? 'default' : 'secondary'}>
                  {permissions[feature.permission as keyof typeof permissions] ? 'Granted' : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>

          {loading && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Waiting for permissions...</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Health Integration Ready</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Great! Your health data will now sync automatically when you use the "Sync" buttons in your daily activities.
        </p>

        <div className="space-y-2">
          {healthFeatures.map((feature) => (
            <div key={feature.permission} className="flex items-center justify-between p-2 rounded-lg bg-green-50">
              <div className="flex items-center space-x-3">
                {feature.icon}
                <span className="text-sm">{feature.title}</span>
              </div>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          ))}
        </div>

        <Button onClick={onComplete} className="w-full">
          Start Tracking
        </Button>
      </CardContent>
    </Card>
  );
};