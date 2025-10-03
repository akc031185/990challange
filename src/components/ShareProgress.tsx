import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Target, Share2, Sparkles, Trophy, TrendingUp } from 'lucide-react';
import { useChallenge } from '../hooks/useChallenge';
import { useCapacitor } from '../hooks/useCapacitor';
import { ImpactStyle } from '@capacitor/haptics';

interface ShareProgressProps {
  className?: string;
}

export const ShareProgress = ({ className }: ShareProgressProps) => {
  const { challengeData, getTodayData } = useChallenge();
  const { triggerHapticFeedback, shareContent } = useCapacitor();
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Early return if data is not loaded yet
  if (!challengeData || !getTodayData) {
    return null;
  }

  const todayData = getTodayData();

  // Helper function to convert DailyData to activities format
  const getActivitiesFromDailyData = (data: any) => {
    return [
      { completed: data.calories?.achieved || false },
      { completed: data.workout?.completed || false },
      { completed: data.sleep?.hours >= 6 && data.sleep?.hours <= 7 },
      { completed: challengeData.supplements?.taken || false },
      { completed: data.habit?.completed || false },
      { completed: data.loi?.submitted || false },
      { completed: data.gratitude?.people?.length >= 2 },
      { completed: data.connection?.made || false },
      { completed: data.posts?.reel?.completed && data.posts?.story?.completed }
    ];
  };

  // Calculate current stats
  const activities = getActivitiesFromDailyData(todayData);
  const completedActivities = activities.filter(a => a.completed).length;
  const totalActivities = 9;
  const earnedBonusPoint = completedActivities === totalActivities;
  
  // Calculate completed days
  const completedDays = Object.values(challengeData.dailyData || {}).filter(day => day.completed).length;
  const progressPercentage = (completedDays / 90) * 100;
  
  // Calculate weekly average (last 7 days including today)
  const weeklyAverage = React.useMemo(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const last7Days = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
      }
      
      let totalActivities = 0;
      let daysWithData = 0;
      
      last7Days.forEach(date => {
        if (date === today) {
          // Today's data from current state
          const completed = completedActivities;
          if (completed > 0) {
            daysWithData++;
            let dayCount = completed;
            if (dayCount === 9) dayCount++; // Bonus point
            totalActivities += dayCount;
          }
        } else if (challengeData.dailyData && challengeData.dailyData[date]) {
          daysWithData++;
          const dayData = challengeData.dailyData[date];
          const dayActivities = getActivitiesFromDailyData(dayData);
          let dayCount = dayActivities.filter(a => a.completed).length;
          
          // BONUS POINT: Complete all 9 activities = +1 extra point
          if (dayCount === 9) dayCount++;
          
          totalActivities += dayCount;
        }
      });
      
      return daysWithData > 0 ? totalActivities / daysWithData : 0;
    } catch (error) {
      console.error('Error calculating weekly average:', error);
      return 0;
    }
  }, [challengeData.dailyData, challengeData.supplements?.taken, completedActivities]);

  const generateShareImage = async () => {
    try {
      if (!canvasRef.current) return null;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

    // Set canvas size for social media (Instagram post size)
    canvas.width = 1080;
    canvas.height = 1080;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(200, 200, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(880, 880, 120, 0, Math.PI * 2);
    ctx.fill();

    // Main content area
    const contentY = 200;
    const centerX = canvas.width / 2;

    // App title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px -apple-system, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('90-Day Challenge', centerX, contentY);

    // Today's date
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    ctx.font = '24px -apple-system, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(dateString, centerX, contentY + 50);

    // Main progress circle
    const circleY = contentY + 200;
    const radius = 120;

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, circleY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Progress circle
    const progressAngle = (completedActivities / totalActivities) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(centerX, circleY, radius - 10, -Math.PI / 2, -Math.PI / 2 + progressAngle);
    ctx.strokeStyle = earnedBonusPoint ? '#10B981' : '#F59E0B';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Today's progress text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 72px -apple-system, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${completedActivities}`, centerX, circleY - 10);
    
    ctx.font = 'bold 32px -apple-system, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(`/ ${totalActivities}`, centerX, circleY + 30);

    ctx.font = '24px -apple-system, system-ui, sans-serif';
    ctx.fillText('Activities Complete', centerX, circleY + 65);

    // Bonus point indicator
    if (earnedBonusPoint) {
      ctx.font = 'bold 28px -apple-system, system-ui, sans-serif';
      ctx.fillStyle = '#10B981';
      ctx.fillText('🎉 PERFECT DAY! +Bonus Point', centerX, circleY + 100);
    }

    // Stats section
    const statsY = circleY + 180;
    const statSpacing = 260;
    const startX = centerX - statSpacing;

    // Stat 1: Challenge Progress
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px -apple-system, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${completedDays}`, startX, statsY);
    ctx.font = '18px -apple-system, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Days Complete', startX, statsY + 25);
    ctx.fillText(`${Math.round(progressPercentage)}% Done`, startX, statsY + 45);

    // Stat 2: Weekly Average
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px -apple-system, system-ui, sans-serif';
    ctx.fillText(`${weeklyAverage.toFixed(1)}`, centerX, statsY);
    ctx.font = '18px -apple-system, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Weekly Avg', centerX, statsY + 25);
    ctx.fillText('(7 days)', centerX, statsY + 45);

    // Stat 3: Streak/Target
    const streakDays = 12; // Calculate actual streak if needed
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px -apple-system, system-ui, sans-serif';
    ctx.fillText(`${streakDays}`, startX + statSpacing * 2, statsY);
    ctx.font = '18px -apple-system, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Day Streak', startX + statSpacing * 2, statsY + 25);
    ctx.fillText('🔥 On Fire!', startX + statSpacing * 2, statsY + 45);

    // Call to action
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '24px -apple-system, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Join the 90-Day Challenge!', centerX, canvas.height - 100);
    
    ctx.font = '20px -apple-system, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('Transform your life with 9 daily actions', centerX, canvas.height - 60);

      // Convert canvas to blob
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, 'image/png', 0.9);
      });
    } catch (error) {
      console.error('Error generating share image:', error);
      return null;
    }
  };

  const handleShare = async () => {
    setIsGenerating(true);
    triggerHapticFeedback(ImpactStyle.Medium);

    try {
      const imageBlob = await generateShareImage();
      if (!imageBlob) {
        throw new Error('Failed to generate image');
      }

      const shareData = {
        title: '90-Day Challenge Progress',
        text: `Day ${completedDays + 1} of my 90-Day Challenge! Today I completed ${completedActivities}/${totalActivities} activities. ${earnedBonusPoint ? '🎉 Perfect day with bonus points!' : 'Working towards my goals!'} #90DayChallenge #PersonalGrowth`,
        files: [new File([imageBlob], 'my-90-day-progress.png', { type: 'image/png' })]
      };

      // Try native sharing first
      const shared = await shareContent(shareData);
      
      if (!shared) {
        // Fallback: download the image
        const url = URL.createObjectURL(imageBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'my-90-day-challenge-progress.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error sharing progress:', error);
      // Could show a toast notification here
    } finally {
      setIsGenerating(false);
    }
  };

  // Only show if user has some progress worth sharing
  const hasProgress = completedActivities > 0 || completedDays > 0 || weeklyAverage > 0;

  if (!hasProgress) {
    return null;
  }

  return (
    <div className={className}>
      {/* Hidden canvas for image generation */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        width={1080}
        height={1080}
      />
      
      {/* Compact share section */}
      <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/10 dark:to-purple-950/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">Share Your Progress</div>
                <div className="text-xs text-muted-foreground">
                  {earnedBonusPoint ? '🎉 Perfect day to share!' : `${completedActivities}/${totalActivities} activities today`}
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleShare}
              disabled={isGenerating}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 active:scale-95 transition-transform"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Share2 className="h-3 w-3 mr-1" />
                  Share
                </>
              )}
            </Button>
          </div>
          
          {/* Quick stats preview */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-dashed border-blue-200 dark:border-blue-800">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{completedDays}</div>
              <div className="text-xs text-muted-foreground">Days</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{weeklyAverage.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Avg</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{completedActivities}/9</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};