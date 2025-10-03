import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { useTeam } from '../../hooks/useTeam';
import { Alert, AlertDescription } from '../ui/alert';
import { Plus, Users, Copy, Check } from 'lucide-react';

interface TeamManagementProps {
  onTeamJoined: () => void;
}

export const TeamManagement = ({ onTeamJoined }: TeamManagementProps) => {
  const { createTeam, joinTeam, loading } = useTeam();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('join');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Create team form
  const [createData, setCreateData] = useState({
    name: '',
    description: ''
  });

  // Join team form
  const [joinCode, setJoinCode] = useState('');

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const result = await createTeam(createData.name, createData.description);
    
    if (result.success && result.teamCode) {
      setTeamCode(result.teamCode);
      setSuccess(`Team created! Share code: ${result.teamCode}`);
      setCreateData({ name: '', description: '' });
      onTeamJoined();
    } else {
      setError(result.error || 'Failed to create team');
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const result = await joinTeam(joinCode);
    
    if (result.success) {
      setSuccess('Successfully joined team!');
      setJoinCode('');
      onTeamJoined();
    } else {
      setError(result.error || 'Failed to join team');
    }
  };

  const copyTeamCode = async () => {
    if (teamCode) {
      await navigator.clipboard.writeText(teamCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Join a Team</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Create a new team or join an existing one
          </p>
        </CardHeader>
        <CardContent>
          {/* Tab buttons */}
          <div className="flex mb-6">
            <Button
              variant={activeTab === 'join' ? 'default' : 'outline'}
              onClick={() => setActiveTab('join')}
              className="flex-1 mr-2"
            >
              Join Team
            </Button>
            <Button
              variant={activeTab === 'create' ? 'default' : 'outline'}
              onClick={() => setActiveTab('create')}
              className="flex-1 ml-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </div>

          {activeTab === 'join' && (
            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="join-code">Team Code</Label>
                <Input
                  id="join-code"
                  type="text"
                  placeholder="Enter team code (e.g., TEAM_ABC123)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Ask your team leader for the team code
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Joining...' : 'Join Team'}
              </Button>
            </form>
          )}

          {activeTab === 'create' && (
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  type="text"
                  placeholder="Enter team name"
                  value={createData.name}
                  onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team-description">Description (Optional)</Label>
                <Textarea
                  id="team-description"
                  placeholder="Describe your team's goals..."
                  value={createData.description}
                  onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Team'}
              </Button>
            </form>
          )}

          {teamCode && (
            <Card className="mt-4 border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-green-700">Team created successfully!</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {teamCode}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyTeamCode}
                      className="h-8"
                    >
                      {copied ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-green-600">
                    Share this code with your team members
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              onClick={onTeamJoined}
              className="text-sm"
            >
              Skip for now - I'll join a team later
            </Button>
          </div>

          {error && (
            <Alert className="mt-4">
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4">
              <AlertDescription className="text-green-600">
                {success}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};