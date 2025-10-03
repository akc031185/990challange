import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface TeamMember {
  userId: string;
  name: string;
  email: string;
  completedDays: number;
  currentStreak: number;
  todayProgress: number;
  progressPercentage: number;
}

interface Team {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  members: Array<{
    userId: string;
    name: string;
    email: string;
  }>;
  memberCount: number;
}

export const useTeam = () => {
  const { accessToken } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [leaderboard, setLeaderboard] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);

  const createTeam = async (name: string, description: string): Promise<{ success: boolean; teamCode?: string; error?: string }> => {
    if (!accessToken) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      setLoading(true);
      
      // For demo: create team locally
      const teamCode = `TEAM_${Date.now().toString(36).toUpperCase()}`;
      const teams = JSON.parse(localStorage.getItem('demo_teams') || '[]');
      
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      
      const newTeam = {
        id: teamCode,
        name,
        description,
        createdBy: userData.id,
        createdAt: new Date().toISOString(),
        members: [{
          userId: userData.id,
          name: userData.name,
          email: userData.email
        }],
        memberCount: 1
      };
      
      teams.push(newTeam);
      localStorage.setItem('demo_teams', JSON.stringify(teams));
      
      setTeam(newTeam);
      return { success: true, teamCode };
    } catch (error) {
      console.error('Create team error:', error);
      return { success: false, error: 'Failed to create team' };
    } finally {
      setLoading(false);
    }
  };

  const joinTeam = async (teamCode: string): Promise<{ success: boolean; error?: string }> => {
    if (!accessToken) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      setLoading(true);
      
      // For demo: join team locally
      const teams = JSON.parse(localStorage.getItem('demo_teams') || '[]');
      const team = teams.find((t: any) => t.id === teamCode);
      
      if (!team) {
        return { success: false, error: 'Team not found' };
      }
      
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      
      // Check if already a member
      if (team.members.some((m: any) => m.userId === userData.id)) {
        return { success: false, error: 'Already a member of this team' };
      }
      
      // Add user to team
      team.members.push({
        userId: userData.id,
        name: userData.name,
        email: userData.email
      });
      team.memberCount = team.members.length;
      
      // Update teams in localStorage
      const updatedTeams = teams.map((t: any) => t.id === teamCode ? team : t);
      localStorage.setItem('demo_teams', JSON.stringify(updatedTeams));
      
      setTeam(team);
      return { success: true };
    } catch (error) {
      console.error('Join team error:', error);
      return { success: false, error: 'Failed to join team' };
    } finally {
      setLoading(false);
    }
  };

  const getTeamLeaderboard = async (teamCode: string): Promise<void> => {
    if (!accessToken) return;

    try {
      setLoading(true);
      
      // For demo: get team leaderboard locally
      const teams = JSON.parse(localStorage.getItem('demo_teams') || '[]');
      const team = teams.find((t: any) => t.id === teamCode);
      
      if (!team) return;
      
      // Generate demo leaderboard data
      const leaderboard = team.members.map((member: any) => {
        // Get random demo data for each member
        const completedDays = Math.floor(Math.random() * 30) + 1;
        const currentStreak = Math.floor(Math.random() * 15) + 1;
        const todayProgress = Math.floor(Math.random() * 9) + 1;
        
        return {
          userId: member.userId,
          name: member.name,
          email: member.email,
          completedDays,
          currentStreak,
          todayProgress,
          progressPercentage: (completedDays / 90) * 100
        };
      }).sort((a: any, b: any) => {
        if (b.completedDays !== a.completedDays) {
          return b.completedDays - a.completedDays;
        }
        return b.currentStreak - a.currentStreak;
      });
      
      setTeam(team);
      setLeaderboard(leaderboard);
    } catch (error) {
      console.error('Get team leaderboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    team,
    leaderboard,
    loading,
    createTeam,
    joinTeam,
    getTeamLeaderboard
  };
};