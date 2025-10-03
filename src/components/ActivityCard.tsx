import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2 } from 'lucide-react';
import { useCapacitor } from '../hooks/useCapacitor';
import { ImpactStyle } from '@capacitor/haptics';

interface ActivityCardProps {
  title: string;
  completed: boolean;
  children: ReactNode;
}

export const ActivityCard = ({ title, completed, children }: ActivityCardProps) => {
  const { triggerHapticFeedback } = useCapacitor();

  const handleCardPress = () => {
    if (completed) {
      triggerHapticFeedback(ImpactStyle.Light);
    }
  };

  return (
    <Card 
      className={`transition-all duration-200 ${completed ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}`}
      onClick={handleCardPress}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between activity-card-title">
          <span className="text-base font-semibold text-foreground">{title}</span>
          {completed && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};