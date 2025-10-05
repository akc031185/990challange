import { ActivityCard } from './ActivityCard';
import { CalorieTracker } from './activities/CalorieTracker';
import { WorkoutTracker } from './activities/WorkoutTracker';
import { SupplementsTracker } from './activities/SupplementsTracker';
import { SleepTracker } from './activities/SleepTracker';
import { HabitTracker } from './activities/HabitTracker';
import { LOITracker } from './activities/LOITracker';
import { GratitudeTracker } from './activities/GratitudeTracker';
import { ConnectionTracker } from './activities/ConnectionTracker';
import { PostsTracker } from './activities/PostsTracker';
import { useChallenge } from '../hooks/useChallenge';

interface DailyTrackerProps {
  selectedDate?: string; // Optional: for editing past dates
}

export const DailyTracker = ({ selectedDate }: DailyTrackerProps = {}) => {
  const { getTodayData, updateTodayData, challengeData, updateSupplements, updateUserSettings, getWeeklyLOICount, updateDateData } = useChallenge();

  // Use selected date or today
  const todayData = selectedDate
    ? (challengeData.dailyData[selectedDate] || getTodayData())
    : getTodayData();

  const updateData = selectedDate && updateDateData
    ? (data: any) => updateDateData(selectedDate, data)
    : updateTodayData;

  return (
    <div className="grid gap-4 grid-cols-1">
      <ActivityCard 
        title="Eat Your Way" 
        completed={todayData.calories.achieved}
      >
        <CalorieTracker
          target={challengeData.userSettings?.calorieTarget || 2000}
          achieved={todayData.calories.achieved}
          onTargetUpdate={(target) => updateUserSettings({ calorieTarget: target })}
          onAchievedUpdate={(achieved) => updateData({ calories: { achieved } })}
        />
      </ActivityCard>

      <ActivityCard 
        title="45-min Workout" 
        completed={todayData.workout.completed}
      >
        <WorkoutTracker
          completed={todayData.workout.completed}
          description={todayData.workout.description}
          onUpdate={(data) => updateData({ workout: data })}
        />
      </ActivityCard>

      <ActivityCard 
        title="Supplements/Vitamins" 
        completed={challengeData.supplements.taken}
      >
        <SupplementsTracker
          list={challengeData.supplements.list}
          taken={challengeData.supplements.taken}
          onUpdate={updateSupplements}
        />
      </ActivityCard>

      <ActivityCard 
        title="Sleep 6-7 Hours" 
        completed={todayData.sleep.hours >= 6 && todayData.sleep.hours <= 7}
      >
        <SleepTracker
          hours={todayData.sleep.hours}
          onUpdate={(hours) => updateData({ sleep: { hours } })}
        />
      </ActivityCard>

      <ActivityCard 
        title="Daily Habit Goal" 
        completed={todayData.habit.completed}
      >
        <HabitTracker
          habitDescription={challengeData.userSettings?.habitDescription || ''}
          completed={todayData.habit.completed}
          onHabitUpdate={(habitDescription) => updateUserSettings({ habitDescription })}
          onCompletedUpdate={(completed) => updateData({ habit: { completed } })}
        />
      </ActivityCard>

      <ActivityCard 
        title="Submit LOI Daily" 
        completed={todayData.loi.submitted}
      >
        <LOITracker
          submitted={todayData.loi.submitted}
          description={todayData.loi.description}
          weeklyCount={getWeeklyLOICount()}
          onUpdate={(data) => updateData({ loi: data })}
        />
      </ActivityCard>

      <ActivityCard 
        title="Text Gratitude to 2 People" 
        completed={todayData.gratitude.people.length >= 2}
      >
        <GratitudeTracker
          people={todayData.gratitude.people}
          onUpdate={(people) => updateData({ gratitude: { people } })}
        />
      </ActivityCard>

      <ActivityCard 
        title="New Professional Connection" 
        completed={todayData.connection.made}
      >
        <ConnectionTracker
          made={todayData.connection.made}
          name={todayData.connection.name}
          onUpdate={(data) => updateData({ connection: data })}
        />
      </ActivityCard>

      <ActivityCard 
        title="Two Posts: Reel + Story" 
        completed={todayData.posts.reel.completed && todayData.posts.story.completed}
      >
        <PostsTracker
          reel={todayData.posts.reel}
          story={todayData.posts.story}
          onUpdate={(data) => updateData({ posts: data })}
        />
      </ActivityCard>
    </div>
  );
};