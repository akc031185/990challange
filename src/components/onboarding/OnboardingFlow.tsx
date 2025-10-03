import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Target, Users, Heart, CheckCircle, ArrowRight } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to 90-Day Challenge",
      description: "Transform your life with 9 daily actions over 90 days",
      icon: <Target className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            Build lasting habits and achieve your goals through consistent daily actions.
          </p>
          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Track 9 daily activities</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Monitor your progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Stay motivated with teams</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Your Daily Activities",
      description: "Complete all 9 activities to earn a bonus point (10 total possible)",
      icon: <Target className="h-12 w-12 text-blue-600" />,
      content: (
        <div className="space-y-3">
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span>🍎 Calorie Management</span>
              <Badge variant="outline">Health</Badge>
            </div>
            <div className="flex justify-between">
              <span>💪 45-min HIIT Workout</span>
              <Badge variant="outline">Fitness</Badge>
            </div>
            <div className="flex justify-between">
              <span>😴 6-7 Hours Sleep</span>
              <Badge variant="outline">Health</Badge>
            </div>
            <div className="flex justify-between">
              <span>💊 Supplements</span>
              <Badge variant="outline">Wellness</Badge>
            </div>
            <div className="flex justify-between">
              <span>🔄 Daily Habit Goal</span>
              <Badge variant="outline">Growth</Badge>
            </div>
            <div className="flex justify-between">
              <span>📝 Letter of Intent</span>
              <Badge variant="outline">Business</Badge>
            </div>
            <div className="flex justify-between">
              <span>🙏 Text Gratitude</span>
              <Badge variant="outline">Social</Badge>
            </div>
            <div className="flex justify-between">
              <span>🤝 New Connection</span>
              <Badge variant="outline">Network</Badge>
            </div>
            <div className="flex justify-between">
              <span>📱 Social Posts</span>
              <Badge variant="outline">Content</Badge>
            </div>
          </div>
          <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs font-medium text-blue-900">💡 Habit Goal Examples:</p>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• <strong>Add:</strong> "Read 10 pages daily", "Meditate 5 minutes"</div>
              <div>• <strong>Remove:</strong> "No social media before noon", "No processed sugar today"</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Track Your Progress",
      description: "Watch your consistency improve with detailed analytics",
      icon: <Target className="h-12 w-12 text-green-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Today's Status</span>
              <span className="text-lg font-bold text-orange-600">7/9 In Progress</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Weekly Average</span>
              <span className="text-lg font-bold text-blue-600">6.3/10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Current Streak</span>
              <span className="text-lg font-bold text-orange-500">7 days</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Complete all 9 activities daily to earn bonus points for your weekly average!
          </p>
        </div>
      )
    },
    {
      title: "Join Teams & Compete",
      description: "Connect with friends and stay motivated together",
      icon: <Users className="h-12 w-12 text-purple-600" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🥇</span>
                <span className="text-sm font-medium">Sarah</span>
              </div>
              <span className="text-sm font-bold">23 days</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🥈</span>
                <span className="text-sm font-medium">Mike</span>
              </div>
              <span className="text-sm font-bold">19 days</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🥉</span>
                <span className="text-sm font-medium">You</span>
              </div>
              <span className="text-sm font-bold">15 days</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Create teams with friends or join existing ones to stay accountable
          </p>
        </div>
      )
    },
    {
      title: "Apple Health Integration",
      description: "Sync your health data for seamless tracking",
      icon: <Heart className="h-12 w-12 text-red-500" />,
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Auto-sync calories and sleep</span>
            </div>
            <div className="text-xs text-red-700">
              Your health data stays private and secure on your device
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Calories Burned</span>
              <span className="font-medium">2,150</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Sleep Duration</span>
              <span className="font-medium">7.2 hrs</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Optional: You can always track manually if you prefer
          </p>
        </div>
      )
    }
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {currentStep.icon}
          </div>
          <CardTitle className="text-xl">{currentStep.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{currentStep.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep.content}

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              {isLastStep ? 'Get Started' : 'Next'}
              {!isLastStep && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Step {step + 1} of {steps.length}
          </p>
        </CardContent>
      </Card>
    </div>                                                                                                                                                                                                                                                                      
  );
};