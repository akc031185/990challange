import { useState, useEffect } from 'react';
import { DailyTracker } from './components/DailyTracker';
import { ProgressOverview } from './components/ProgressOverview';
import { ShareProgress } from './components/ShareProgress';
import { ChallengeCalendar } from './components/ChallengeCalendar';
import { MobileOptimizations } from './components/MobileOptimizations';
import { AuthProvider } from './components/auth/AuthProvider';
import { AuthForm } from './components/auth/AuthForm';
import { TeamManagement } from './components/team/TeamManagement';
import { Leaderboard } from './components/team/Leaderboard';
import { HealthKitSetup } from './components/health/HealthKitSetup';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { ProfileSettings } from './components/profile/ProfileSettings';
import { useAuth } from './hooks/useAuth';
import { useChallenge } from './hooks/useChallenge';
import { useHealthKit } from './hooks/useHealthKit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Settings, Users, Target, Heart } from 'lucide-react';

const AppContent = () => {
  const { user, loading, signOut, accessToken, isNewUser, markUserAsOnboarded } = useAuth();
  const [showTeamSetup, setShowTeamSetup] = useState(false);
  const [showHealthSetup, setShowHealthSetup] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [userTeamId, setUserTeamId] = useState<string | null>(null);
  const { isAvailable: healthAvailable} = useHealthKit();

  // Initialize challenge data syncing with auth token
  useChallenge(accessToken);

  useEffect(() => {
    // Check if user needs onboarding
    if (user && !loading) {
      // Always show onboarding for new users (just signed up)
      if (isNewUser) {
        setShowOnboarding(true);
      } else {
        // For returning users, check if they've completed onboarding
        const hasSeenOnboarding = localStorage.getItem(`onboarding_completed_${user.id}`);
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }
      }
    }

    // Load user's current team
    if (user) {
      const teams = JSON.parse(localStorage.getItem('demo_teams') || '[]');
      const userTeam = teams.find((t: any) => 
        t.members.some((m: any) => m.userId === user.id)
      );
      if (userTeam) {
        setUserTeamId(userTeam.id);
      }
    }
  }, [user, loading, isNewUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  if (showOnboarding) {
    return (
      <OnboardingFlow 
        onComplete={() => {
          setShowOnboarding(false);
          // Store onboarding completion for this specific user
          if (user?.id) {
            localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
          }
          // Mark user as no longer new (onboarding complete)
          markUserAsOnboarded();
        }} 
      />
    );
  }

  if (showTeamSetup) {
    return (
      <TeamManagement 
        onTeamJoined={() => {
          setShowTeamSetup(false);
          // Refresh team data
          if (user) {
            const teams = JSON.parse(localStorage.getItem('demo_teams') || '[]');
            const userTeam = teams.find((t: any) => 
              t.members.some((m: any) => m.userId === user.id)
            );
            if (userTeam) {
              setUserTeamId(userTeam.id);
            }
          }
        }} 
      />
    );
  }

  if (showHealthSetup) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-4 max-w-md">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-xl font-bold text-primary">Health Setup</h1>
              <p className="text-xs text-muted-foreground">
                Connect your health data for better tracking
              </p>
            </div>
            <HealthKitSetup onComplete={() => setShowHealthSetup(false)} />
          </div>
        </div>
      </div>
    );
  }

  if (showProfile) {
    return (
      <ProfileSettings onClose={() => setShowProfile(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-optimized container */}
      <div className="container mx-auto px-4 py-4 max-w-md">
        <div className="space-y-6">
          {/* Header - Mobile first */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-primary">90-Day Challenge</h1>
              </div>
              <div className="flex items-center space-x-1">
                {healthAvailable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHealthSetup(true)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTeamSetup(true)}
                >
                  <Users className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfile(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Welcome back, {user.name || user.email}
            </p>
          </div>

          {/* Main Content - Mobile optimized tabs */}
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="today" className="text-xs">Today</TabsTrigger>
              <TabsTrigger value="progress" className="text-xs">Progress</TabsTrigger>
              <TabsTrigger value="team" className="text-xs">Team</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="mt-6 overflow-y-auto max-h-[calc(100vh-16rem)] pb-20">
              <div className="space-y-4">
                {/* Progress Overview */}
                <ProgressOverview />

                {/* Share Progress - Show if user has some progress */}
                <ShareProgress />

                <div className="text-center">
                  <h2 className="text-xl font-semibold">Complete Your Daily Actions</h2>
                  <p className="text-sm text-muted-foreground">
                    Complete all 9 activities to earn bonus points for weekly averages
                  </p>
                </div>
                <DailyTracker />
              </div>
            </TabsContent>
            
            <TabsContent value="progress" className="mt-6 overflow-y-auto max-h-[calc(100vh-16rem)] pb-20">
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Your Progress</h2>
                  <p className="text-sm text-muted-foreground">
                    Track your journey and celebrate your achievements
                  </p>
                </div>
                <ProgressOverview />

                {/* Calendar View */}
                <div className="grid gap-3">
                  <ChallengeCalendar onDateSelect={(date) => setSelectedDate(date)} />
                </div>

                {/* Share Progress */}
                <ShareProgress />

                {/* Edit Modal for Selected Date */}
                {selectedDate && (
                  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">
                          Edit {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </h3>
                        <Button onClick={() => setSelectedDate(null)} variant="ghost" size="sm">
                          Close
                        </Button>
                      </div>
                      <div className="p-4 overflow-y-auto max-h-[calc(90vh-5rem)]">
                        <DailyTracker selectedDate={selectedDate} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="mt-6">
              <div className="space-y-4">
                {userTeamId ? (
                  <Leaderboard teamId={userTeamId} />
                ) : (
                  <div className="text-center space-y-4">
                    <div className="p-6 border-2 border-dashed border-border rounded-lg">
                      <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="font-semibold mb-2">Join a Team</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Compete with friends and stay motivated together
                      </p>
                      <Button onClick={() => setShowTeamSetup(true)}>
                        Join or Create Team
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* iOS Optimizations */}
      <MobileOptimizations />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}