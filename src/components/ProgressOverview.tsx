import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Celebration } from './ui/celebration';
import { useChallenge } from '../hooks/useChallenge';
import { Calendar, Target, Flame } from 'lucide-react';

export const ProgressOverview = () => {
  const { getCompletedDays, getCurrentStreak, getTodayData, challengeData } = useChallenge();
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastPerfectDay, setLastPerfectDay] = useState<string | null>(null);
  
  const completedDays = getCompletedDays();
  const currentStreak = getCurrentStreak();
  const todayData = getTodayData();
  const progressPercentage = (completedDays / 90) * 100;
  
  // Count completed activities for today - memoized for better reactivity
  const completedActivities = useMemo(() => {
    let count = 0;
    
    // 1. Calories
    if (todayData.calories.achieved) count++;
    
    // 2. Workout
    if (todayData.workout.completed) count++;
    
    // 3. Sleep (6-7 hours)
    if (todayData.sleep.hours >= 6 && todayData.sleep.hours <= 7) count++;
    
    // 4. Supplements
    if (challengeData.supplements.taken) count++;
    
    // 5. Habits (completed status)
    if (todayData.habit.completed) count++;
    
    // 6. LOI
    if (todayData.loi.submitted) count++;
    
    // 7. Gratitude (2 people)
    if (todayData.gratitude.people.length >= 2) count++;
    
    // 8. Connection
    if (todayData.connection.made) count++;
    
    // 9. Posts (both reel AND story)
    if (todayData.posts.reel.completed && todayData.posts.story.completed) count++;
    
    // Return just the base activities count (0-9) for daily display
    return count;
  }, [
    todayData.calories.achieved,
    todayData.workout.completed,
    todayData.sleep.hours,
    challengeData.supplements.taken,
    todayData.habit.completed,
    todayData.loi.submitted,
    todayData.gratitude.people.length,
    todayData.connection.made,
    todayData.posts.reel.completed,
    todayData.posts.story.completed
  ]);

  // Separate calculation for whether user earned bonus point (for celebrations)
  const earnedBonusPoint = completedActivities === 9;

  // Calculate weekly average
  const weeklyAverage = useMemo(() => {
    const today = new Date();
    const last7Days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }
    
    let totalActivities = 0;
    let daysWithData = 0;
    
    last7Days.forEach(date => {
      const dayData = challengeData.dailyData[date];
      if (dayData) {
        daysWithData++;
        let dayCount = 0;
        
        if (dayData.calories?.achieved) dayCount++;
        if (dayData.workout?.completed) dayCount++;
        if (dayData.sleep?.hours >= 6 && dayData.sleep?.hours <= 7) dayCount++;
        if (date === todayData.date ? challengeData.supplements.taken : false) dayCount++; // Supplements are global
        if (dayData.habit?.completed) dayCount++;
        if (dayData.loi?.submitted) dayCount++;
        if (dayData.gratitude?.people?.length >= 2) dayCount++;
        if (dayData.connection?.made) dayCount++;
        if (dayData.posts?.reel?.completed && dayData.posts?.story?.completed) dayCount++;
        
        // BONUS POINT: Complete all 9 activities = +1 extra point
        if (dayCount === 9) dayCount++;
        
        totalActivities += dayCount;
      }
    });
    
    return daysWithData > 0 ? totalActivities / daysWithData : 0;
  }, [challengeData.dailyData, challengeData.supplements.taken, todayData.date]);

  // Check for perfect day achievement (when all 9 activities are complete)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (earnedBonusPoint && lastPerfectDay !== today) {
      setShowCelebration(true);
      setLastPerfectDay(today);
    }
  }, [earnedBonusPoint, lastPerfectDay]);
  
  const totalActivities = 9;

  return (
    <>
      <Celebration 
        show={showCelebration} 
        onComplete={() => setShowCelebration(false)} 
      />
      <div className="grid gap-3 grid-cols-2">
        <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="progress-title text-xs font-medium text-muted-foreground uppercase tracking-wide">Challenge Progress</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="progress-value text-3xl font-bold text-foreground">{completedDays}</span>
              <span className="progress-meta text-sm text-muted-foreground">/ 90 days</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="progress-meta text-xs text-muted-foreground">
              {Math.round(progressPercentage)}% complete
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="progress-title text-xs font-medium text-muted-foreground uppercase tracking-wide">Today's Status</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`progress-value text-2xl font-bold leading-tight ${todayData.completed ? 'text-green-600' : 'text-orange-600'}`}>
            {completedActivities}/{totalActivities}
          </div>
          <div className="progress-meta text-xs font-medium text-muted-foreground mt-1">
            {todayData.completed ? 'Complete' : 'In Progress'}
          </div>
          <p className="progress-meta text-xs text-muted-foreground mt-2">
            {earnedBonusPoint ? '🎉 Perfect Day + Bonus!' : new Date().toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="progress-title text-xs font-medium text-muted-foreground uppercase tracking-wide">Weekly Average</CardTitle>
          <Flame className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="progress-value text-2xl font-bold text-blue-600 leading-tight">
            {weeklyAverage.toFixed(1)}/10
          </div>
          <p className="progress-meta text-xs text-muted-foreground mt-1">
            avg per day (7 days)
          </p>
        </CardContent>
      </Card>
    </div>
    </>
  );
};