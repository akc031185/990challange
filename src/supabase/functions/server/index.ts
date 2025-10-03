import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// User signup
app.post('/make-server-003cd299/auth/signup', async (c) => {
  try {
    const { email, password, name, teamCode } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: `Signup failed: ${error.message}` }, 400);
    }

    // Create user profile in KV store
    const userId = data.user.id;
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      name,
      teamId: teamCode || null,
      joinedAt: new Date().toISOString(),
      challengeData: {
        startDate: new Date().toISOString().split('T')[0],
        currentDay: 1,
        dailyData: {},
        supplements: { list: [], taken: false },
        userSettings: {
          calorieTarget: 2000,
          habitToRemove: '',
          habitToAdd: ''
        }
      }
    });

    // Join team if team code provided
    if (teamCode) {
      const team = await kv.get(`team:${teamCode}`);
      if (team) {
        const updatedTeam = {
          ...team,
          members: [...team.members, { userId, name, email }],
          memberCount: team.memberCount + 1
        };
        await kv.set(`team:${teamCode}`, updatedTeam);
      }
    }

    return c.json({ user: data.user, success: true });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: `Signup failed: ${error}` }, 500);
  }
});

// User signin
app.post('/make-server-003cd299/auth/signin', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log('Signin error:', error);
      return c.json({ error: `Signin failed: ${error.message}` }, 400);
    }

    return c.json({ session: data.session, user: data.user, success: true });
  } catch (error) {
    console.log('Signin error:', error);
    return c.json({ error: `Signin failed: ${error}` }, 500);
  }
});

// Create team
app.post('/make-server-003cd299/teams/create', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name, description } = await c.req.json();
    const teamCode = `TEAM_${Date.now().toString(36).toUpperCase()}`;
    
    const userProfile = await kv.get(`user:${user.id}`);
    
    const team = {
      id: teamCode,
      name,
      description,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      members: [{
        userId: user.id,
        name: userProfile?.name || user.email,
        email: user.email
      }],
      memberCount: 1
    };

    await kv.set(`team:${teamCode}`, team);
    
    // Update user's team
    if (userProfile) {
      await kv.set(`user:${user.id}`, {
        ...userProfile,
        teamId: teamCode
      });
    }

    return c.json({ team, teamCode });
  } catch (error) {
    console.log('Team creation error:', error);
    return c.json({ error: `Team creation failed: ${error}` }, 500);
  }
});

// Join team
app.post('/make-server-003cd299/teams/join', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { teamCode } = await c.req.json();
    const team = await kv.get(`team:${teamCode}`);
    
    if (!team) {
      return c.json({ error: 'Team not found' }, 404);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    
    // Check if user is already in team
    const isAlreadyMember = team.members.some(m => m.userId === user.id);
    if (isAlreadyMember) {
      return c.json({ error: 'Already a member of this team' }, 400);
    }

    // Add user to team
    const updatedTeam = {
      ...team,
      members: [...team.members, {
        userId: user.id,
        name: userProfile?.name || user.email,
        email: user.email
      }],
      memberCount: team.memberCount + 1
    };
    
    await kv.set(`team:${teamCode}`, updatedTeam);
    
    // Update user's team
    if (userProfile) {
      await kv.set(`user:${user.id}`, {
        ...userProfile,
        teamId: teamCode
      });
    }

    return c.json({ team: updatedTeam });
  } catch (error) {
    console.log('Team join error:', error);
    return c.json({ error: `Failed to join team: ${error}` }, 500);
  }
});

// Get team info and leaderboard
app.get('/make-server-003cd299/teams/:teamCode', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const teamCode = c.req.param('teamCode');
    const team = await kv.get(`team:${teamCode}`);
    
    if (!team) {
      return c.json({ error: 'Team not found' }, 404);
    }

    // Get challenge data for all team members
    const leaderboard = [];
    
    for (const member of team.members) {
      const memberProfile = await kv.get(`user:${member.userId}`);
      if (memberProfile?.challengeData) {
        const challengeData = memberProfile.challengeData;
        const completedDays = Object.values(challengeData.dailyData).filter(day => day.completed).length;
        
        // Calculate current streak
        const sortedDays = Object.entries(challengeData.dailyData)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
        
        let currentStreak = 0;
        for (const [, dayData] of sortedDays) {
          if (dayData.completed) {
            currentStreak++;
          } else {
            break;
          }
        }

        // Get today's progress
        const today = new Date().toISOString().split('T')[0];
        const todayData = challengeData.dailyData[today];
        let todayProgress = 0;
        
        if (todayData) {
          if (todayData.calories?.achieved) todayProgress++;
          if (todayData.workout?.completed) todayProgress++;
          if (todayData.sleep?.hours >= 6 && todayData.sleep?.hours <= 7) todayProgress++;
          if (challengeData.supplements?.taken) todayProgress++;
          if (todayData.habit?.completed) todayProgress++;
          if (todayData.loi?.submitted) todayProgress++;
          if (todayData.gratitude?.people?.length >= 2) todayProgress++;
          if (todayData.connection?.made) todayProgress++;
          if (todayData.posts?.reel?.completed && todayData.posts?.story?.completed) todayProgress++;
        }

        leaderboard.push({
          userId: member.userId,
          name: member.name,
          email: member.email,
          completedDays,
          currentStreak,
          todayProgress,
          progressPercentage: (completedDays / 90) * 100
        });
      }
    }

    // Sort leaderboard by completed days (desc), then by current streak (desc)
    leaderboard.sort((a, b) => {
      if (b.completedDays !== a.completedDays) {
        return b.completedDays - a.completedDays;
      }
      return b.currentStreak - a.currentStreak;
    });

    return c.json({ team, leaderboard });
  } catch (error) {
    console.log('Get team error:', error);
    return c.json({ error: `Failed to get team: ${error}` }, 500);
  }
});

// Update user challenge data
app.post('/make-server-003cd299/challenge/update', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const challengeData = await c.req.json();
    
    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile) {
      await kv.set(`user:${user.id}`, {
        ...userProfile,
        challengeData,
        lastUpdated: new Date().toISOString()
      });
    }

    return c.json({ success: true });
  } catch (error) {
    console.log('Challenge update error:', error);
    return c.json({ error: `Failed to update challenge: ${error}` }, 500);
  }
});

// Get user profile
app.get('/make-server-003cd299/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    
    if (!userProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile: userProfile });
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: `Failed to get profile: ${error}` }, 500);
  }
});

serve(app.fetch);