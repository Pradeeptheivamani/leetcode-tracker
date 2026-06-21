import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const PROFILE_TOKEN_PREFIX = 'leetcode-profile:';

function buildProfile(username) {
  return {
    id: username,
    username,
    email: '',
    leetcodeUsername: username,
    role: 'USER',
    currentStreak: 0,
    longestStreak: 0,
    trackedUsers: [],
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token?.startsWith(PROFILE_TOKEN_PREFIX)) {
      setUser(buildProfile(token.slice(PROFILE_TOKEN_PREFIX.length)));
    }
    setLoading(false);
  }, []);

  const connectLeetCode = async (username) => {
    const cleanUsername = username.trim();
    if (!cleanUsername) throw new Error('Enter your LeetCode username');

    const response = await fetch(`https://alfa-leetcode-api.onrender.com/${cleanUsername}`);
    const data = await response.json();
    if (!response.ok || data.errors || data.status === 'error') {
      throw new Error('LeetCode profile not found');
    }

    const profile = buildProfile(cleanUsername);
    localStorage.setItem('token', `${PROFILE_TOKEN_PREFIX}${cleanUsername}`);
    setUser(profile);
    return { user: profile, stats: data };
  };

  const updateProfile = async (profileData) => {
    const updated = { ...user, ...profileData };
    if (profileData.leetcodeUsername) {
      updated.username = profileData.leetcodeUsername;
      localStorage.setItem('token', `${PROFILE_TOKEN_PREFIX}${profileData.leetcodeUsername}`);
    }
    setUser(updated);
    return { user: updated };
  };

  const trackUser = async (username) => {
    const updated = { ...user, trackedUsers: [...new Set([...(user.trackedUsers || []), username])] };
    setUser(updated);
    return updated;
  };

  const untrackUser = async (username) => {
    const updated = { ...user, trackedUsers: (user.trackedUsers || []).filter((item) => item !== username) };
    setUser(updated);
    return updated;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, connectLeetCode, logout, updateProfile, trackUser, untrackUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
