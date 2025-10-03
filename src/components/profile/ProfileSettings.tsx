import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../hooks/useAuth';
import { useTeam } from '../../hooks/useTeam';
import { User, Users, Settings, LogOut, Edit3, Check, X, AlertCircle } from 'lucide-react';

interface ProfileSettingsProps {
  onClose: () => void;
}

export const ProfileSettings = ({ onClose }: ProfileSettingsProps) => {
  const { user, signOut } = useAuth();
  const { team, joinTeam, loading } = useTeam();
  const [editingName, setEditingName] = useState(false);
  const [editingTeam, setEditingTeam] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [teamCode, setTeamCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Load user's current team if they have one
    const storedTeams = JSON.parse(localStorage.getItem('demo_teams') || '[]');
    const userTeam = storedTeams.find((t: any) => 
      t.members.some((m: any) => m.userId === user?.id)
    );
    if (userTeam) {
      // Set team in useTeam hook (you might need to add a setTeam function)
    }
  }, [user?.id]);

  const handleNameSave = () => {
    // In a real app, you'd update the user's name in the backend
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    const updatedUser = { ...userData, name: newName };
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    
    // Update demo users array
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user?.id ? { ...u, name: newName } : u
    );
    localStorage.setItem('demo_users', JSON.stringify(updatedUsers));
    
    setEditingName(false);
    setSuccess('Name updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleJoinTeam = async () => {
    if (!teamCode.trim()) {
      setError('Please enter a team code');
      return;
    }

    setError('');
    const result = await joinTeam(teamCode.toUpperCase());
    
    if (result.success) {
      setSuccess('Successfully joined team!');
      setTeamCode('');
      setEditingTeam(false);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to join team');
    }
  };

  const handleLeaveTeam = () => {
    // In a real app, you'd call an API to leave the team
    const teams = JSON.parse(localStorage.getItem('demo_teams') || '[]');
    const updatedTeams = teams.map((t: any) => ({
      ...t,
      members: t.members.filter((m: any) => m.userId !== user?.id),
      memberCount: t.members.filter((m: any) => m.userId !== user?.id).length
    }));
    localStorage.setItem('demo_teams', JSON.stringify(updatedTeams));
    
    setSuccess('Left team successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const getCurrentTeam = () => {
    const teams = JSON.parse(localStorage.getItem('demo_teams') || '[]');
    return teams.find((t: any) => 
      t.members.some((m: any) => m.userId === user?.id)
    );
  };

  const currentTeam = getCurrentTeam();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 max-w-md">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-primary">Profile Settings</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription className="text-green-600">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                  {user?.email}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Display Name</Label>
                {editingName ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter your name"
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleNameSave}>
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setEditingName(false);
                        setNewName(user?.name || '');
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{user?.name || 'No name set'}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setEditingName(true)}
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Team Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentTeam ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Current Team</Label>
                    <div className="bg-muted/30 p-3 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{currentTeam.name}</span>
                        <Badge variant="outline">{currentTeam.id}</Badge>
                      </div>
                      {currentTeam.description && (
                        <p className="text-xs text-muted-foreground">
                          {currentTeam.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {currentTeam.memberCount} members
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleLeaveTeam}
                          className="text-xs"
                        >
                          Leave Team
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-center p-4 border-2 border-dashed border-border rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      You're not part of any team yet
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => setEditingTeam(true)}
                      disabled={editingTeam}
                    >
                      Join a Team
                    </Button>
                  </div>

                  {editingTeam && (
                    <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                      <div className="space-y-2">
                        <Label>Team Code</Label>
                        <Input
                          value={teamCode}
                          onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                          placeholder="Enter team code (e.g., TEAM_ABC123)"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={handleJoinTeam}
                          disabled={loading}
                          className="flex-1"
                        >
                          {loading ? 'Joining...' : 'Join Team'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setEditingTeam(false);
                            setTeamCode('');
                            setError('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Team Code for Current Team */}
              {currentTeam && (
                <div className="space-y-2">
                  <Label>Share Team Code</Label>
                  <div className="flex items-center space-x-2">
                    <div className="bg-muted/30 p-2 rounded text-sm font-mono flex-1">
                      {currentTeam.id}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(currentTeam.id);
                        setSuccess('Team code copied!');
                        setTimeout(() => setSuccess(''), 2000);
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Share this code with friends to invite them to your team
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* App Information */}
          <Card>
            <CardHeader>
              <CardTitle>App Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Version</span>
                <span className="text-muted-foreground">1.0.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Challenge Started</span>
                <span className="text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Sign Out */}
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={signOut}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};