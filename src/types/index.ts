export interface DailyData {
  date: string;
  calories: {
    achieved: boolean; // Only daily achievement status
  };
  workout: {
    completed: boolean;
    description: string;
  };
  sleep: {
    hours: number;
  };
  habit: {
    completed: boolean; // Only daily completion status
  };
  loi: {
    submitted: boolean;
    description: string;
  };
  gratitude: {
    people: string[];
  };
  connection: {
    made: boolean;
    name: string;
  };
  posts: {
    reel: {
      completed: boolean;
      link: string;
    };
    story: {
      completed: boolean;
      link: string;
    };
  };
  completed: boolean;
}

export interface Supplements {
  list: string[];
  taken: boolean;
}

export interface UserSettings {
  calorieTarget: number;
  habitDescription: string;
}

export interface ChallengeData {
  startDate: string;
  currentDay: number;
  dailyData: Record<string, DailyData>;
  supplements: Supplements;
  userSettings: UserSettings;
}