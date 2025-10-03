import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useTeam } from '../../hooks/useTeam';
import { useAuth } from '../../hooks/useAuth';
import { Trophy, Medal, Award, Users, Flame, Target } from 'lucide-react';

interface LeaderboardProps {
  teamId: string;
}

export const Leaderboard = ({ teamId }: LeaderboardProps) => {
  const { team, leaderboard, getTeamLeaderboard, loading } = useTeam();
  const { user } = useAuth();

  useEffect(() => {
    if (teamId) {
      getTeamLeaderboard(teamId);
      // Refresh every 30 seconds
      const interval = setInterval(() => {
        getTeamLeaderboard(teamId);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [teamId]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <Badge className="bg-yellow-500 text-yellow-50">🥇 1st</Badge>;
      case 1:
        return <Badge className="bg-gray-400 text-gray-50">🥈 2nd</Badge>;
      case 2:
        return <Badge className="bg-amber-600 text-amber-50">🥉 3rd</Badge>;
      default:
        return <Badge variant="outline">#{index + 1}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Team Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!team || !leaderboard.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Team Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">No team data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Team Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>{team.name}</span>
          </CardTitle>
          {team.description && (
            <p className="text-sm text-muted-foreground">{team.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{team.memberCount} members</span>
            </div>
            <Badge variant="outline">{team.id}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((member, index) => (
              <div
                key={member.userId}
                className={`p-4 rounded-lg border ${
                  member.userId === user?.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(index)}
                    <div>
                      <p className="font-medium">
                        {member.name}
                        {member.userId === user?.id && (
                          <span className="text-xs text-primary ml-2">(You)</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  {getRankBadge(index)}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="text-lg font-bold text-green-600">
                        {member.completedDays}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Days Completed</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-lg font-bold text-orange-500">
                        {member.currentStreak}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Current Streak</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Today's Progress</span>
                    <span className="text-sm font-medium">{member.todayProgress}/9</span>
                  </div>
                  <Progress 
                    value={(member.todayProgress / 9) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Challenge Progress</span>
                  <span className="text-xs font-medium">
                    {Math.round(member.progressPercentage)}% complete
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};