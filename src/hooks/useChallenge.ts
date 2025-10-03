import { useState, useEffect } from 'react';
import { ChallengeData, DailyData, UserSettings } from '../types';

const getDefaultDailyData = (date: string): DailyData => ({
  date,
  calories: { achieved: false },
  workout: { completed: false, description: '' },
  sleep: { hours: 0 },
  habit: { completed: false },
  loi: { submitted: false, description: '' },
  gratitude: { people: [] },
  connection: { made: false, name: '' },
  posts: { 
    reel: { completed: false, link: '' },
    story: { completed: false, link: '' }
  },
  completed: false
});

const getDefaultChallengeData = (): ChallengeData => ({
  startDate: new Date().toISOString().split('T')[0],
  currentDay: 1,
  dailyData: {},
  supplements: { list: [], taken: false },
  userSettings: {
    calorieTarget: 2000,
    habitDescription: ''
  }
});

export const useChallenge = (accessToken?: string | null) => {
  const [challengeData, setChallengeData] = useState<ChallengeData>(getDefaultChallengeData());

  useEffect(() => {
    const loadData = async () => {
      // First load from localStorage
      const stored = localStorage.getItem('90dayChallenge');
      if (stored) {
        const data = JSON.parse(stored);
        
        // Migration: Move old structure to new structure
        if (!data.userSettings) {
          const migratedData = {
            ...data,
            userSettings: {
              calorieTarget: 2000,
              habitDescription: ''
            }
          };
          
          // Migrate old daily data structure
          Object.keys(migratedData.dailyData).forEach(date => {
            const dayData = migratedData.dailyData[date];
            if (dayData.calories && typeof dayData.calories.target === 'number') {
              // Extract calorie target for user settings if it's higher than default
              if (dayData.calories.target > migratedData.userSettings.calorieTarget) {
                migratedData.userSettings.calorieTarget = dayData.calories.target;
              }
              // Convert calories structure
              migratedData.dailyData[date].calories = { achieved: dayData.calories.achieved };
            }
            
            if (dayData.habit && (dayData.habit.remove || dayData.habit.add)) {
              // Extract habit settings for user settings (prefer add over remove)
              const habitText = dayData.habit.add || dayData.habit.remove;
              if (habitText && !migratedData.userSettings.habitDescription) {
                migratedData.userSettings.habitDescription = habitText;
              }
              // Convert habit structure
              migratedData.dailyData[date].habit = { 
                completed: dayData.habit.remove?.trim() !== '' || dayData.habit.add?.trim() !== ''
              };
            }
          });
          
          setChallengeData(migratedData);
          localStorage.setItem('90dayChallenge', JSON.stringify(migratedData));
        } else {
          setChallengeData(data);
        }
      }

      // For demo: backend sync will be added later
      // if (accessToken && accessToken.startsWith('demo_')) {
      //   console.log('Demo mode: Using local data only');
      // }
    };

    loadData();
  }, [accessToken]);

  const saveData = async (data: ChallengeData) => {
    setChallengeData(data);
    localStorage.setItem('90dayChallenge', JSON.stringify(data));
    
    // For demo: sync will be added later when backend is ready
    // if (accessToken && accessToken.startsWith('demo_')) {
    //   console.log('Demo mode: Challenge data saved locally');
    // }
  };

  const getTodayData = (): DailyData => {
    const today = new Date().toISOString().split('T')[0];
    return challengeData.dailyData[today] || getDefaultDailyData(today);
  };

  const updateTodayData = (updates: Partial<DailyData>) => {
    const today = new Date().toISOString().split('T')[0];
    const todayData = getTodayData();
    const updatedData = { ...todayData, ...updates };
    
    // Check if all activities are completed
    const isCompleted = 
      updatedData.calories.achieved &&
      updatedData.workout.completed &&
      updatedData.sleep.hours >= 6 && updatedData.sleep.hours <= 7 &&
      challengeData.supplements.taken &&
      updatedData.habit.completed &&
      updatedData.loi.submitted &&
      updatedData.gratitude.people.length >= 2 &&
      updatedData.connection.made &&
      updatedData.posts.reel.completed &&
      updatedData.posts.story.completed;

    updatedData.completed = isCompleted;

    const newChallengeData = {
      ...challengeData,
      dailyData: {
        ...challengeData.dailyData,
        [today]: updatedData
      }
    };

    saveData(newChallengeData);
  };

  const updateSupplements = (supplements: { list: string[], taken: boolean }) => {
    const newChallengeData = {
      ...challengeData,
      supplements
    };
    
    // Also update today's completion status since supplements affect it
    const today = new Date().toISOString().split('T')[0];
    const todayData = getTodayData();
    
    const isCompleted = 
      todayData.calories.achieved &&
      todayData.workout.completed &&
      todayData.sleep.hours >= 6 && todayData.sleep.hours <= 7 &&
      supplements.taken &&
      todayData.habit.completed &&
      todayData.loi.submitted &&
      todayData.gratitude.people.length >= 2 &&
      todayData.connection.made &&
      todayData.posts.reel.completed &&
      todayData.posts.story.completed;

    const updatedTodayData = { ...todayData, completed: isCompleted };
    
    newChallengeData.dailyData = {
      ...newChallengeData.dailyData,
      [today]: updatedTodayData
    };
    
    saveData(newChallengeData);
  };

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    const newChallengeData = {
      ...challengeData,
      userSettings: {
        ...challengeData.userSettings,
        ...settings
      }
    };
    
    // Also update today's completion status since habit settings affect it
    const today = new Date().toISOString().split('T')[0];
    const todayData = getTodayData();
    
    // Recalculate habit completion based on new settings
    const habitCompleted = (
      settings.habitDescription?.trim() !== '' && 
      newChallengeData.userSettings.habitDescription.trim() !== ''
    ) || todayData.habit.completed;
    
    const updatedTodayData = { 
      ...todayData, 
      habit: { completed: habitCompleted }
    };
    
    const isCompleted = 
      updatedTodayData.calories.achieved &&
      updatedTodayData.workout.completed &&
      updatedTodayData.sleep.hours >= 6 && updatedTodayData.sleep.hours <= 7 &&
      challengeData.supplements.taken &&
      updatedTodayData.habit.completed &&
      updatedTodayData.loi.submitted &&
      updatedTodayData.gratitude.people.length >= 2 &&
      updatedTodayData.connection.made &&
      updatedTodayData.posts.reel.completed &&
      updatedTodayData.posts.story.completed;

    updatedTodayData.completed = isCompleted;
    
    newChallengeData.dailyData = {
      ...newChallengeData.dailyData,
      [today]: updatedTodayData
    };
    
    saveData(newChallengeData);
  };

  const getCompletedDays = () => {
    return Object.values(challengeData.dailyData).filter(day => day.completed).length;
  };

  const getCurrentStreak = () => {
    const sortedDays = Object.entries(challengeData.dailyData)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
    
    let streak = 0;
    for (const [, dayData] of sortedDays) {
      if (dayData.completed) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getWeeklyLOICount = () => {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    return Object.entries(challengeData.dailyData)
      .filter(([date]) => date >= weekStartStr)
      .reduce((count, [, dayData]) => count + (dayData.loi.submitted ? 1 : 0), 0);
  };

  return {
    challengeData,
    getTodayData,
    updateTodayData,
    updateSupplements,
    updateUserSettings,
    getCompletedDays,
    getCurrentStreak,
    getWeeklyLOICount
  };
};