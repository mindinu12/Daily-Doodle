"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface UserStats {
  highScore: number;
  gamesPlayed: number;
  totalClicks: number;
  questsCompleted: number;
}

export interface UserAvatar {
  hair: string;
  face: string;
  clothes: string;
}

export interface UserProfile {
  username: string;
  avatar: UserAvatar;
  stats: UserStats;
  followers: number;
  following: number;
  badgeIds: string[];
}

export interface DoodleCreation {
  id: number;
  username: string;
  avatar: UserAvatar;
  likes: number;
  highScore: number;
  timestamp: string;
}

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  accounts: UserProfile[];
  setAccounts: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  creations: DoodleCreation[];
  setCreations: React.Dispatch<React.SetStateAction<DoodleCreation[]>>;
  likedCreations: number[];
  toggleLikeCreation: (id: number) => void;
  cloneOutfit: (avatar: UserAvatar) => void;
  followingUsers: string[];
  toggleFollowUser: (username: string) => void;
  switchProfile: (username: string) => void;
  createNewAccount: (username: string) => void;
  tasks: { text: string; completed: boolean }[];
  setTasks: React.Dispatch<React.SetStateAction<{ text: string; completed: boolean }[]>>;
  toggleTask: (index: number) => void;
  addGamePlayed: (score: number, clicks: number) => void;
  showIntro: boolean;
  setShowIntro: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_ACCOUNTS: UserProfile[] = [
  {
    username: "doodle_king",
    avatar: { hair: "👑", face: "😎", clothes: "🧥" },
    stats: { highScore: 48, gamesPlayed: 32, totalClicks: 412, questsCompleted: 24 },
    followers: 9999,
    following: 3,
    badgeIds: ["Legend", "Click Master", "Stylist"]
  },
  {
    username: "sara_doodles",
    avatar: { hair: "🎀", face: "🧐", clothes: "👗" },
    stats: { highScore: 22, gamesPlayed: 14, totalClicks: 154, questsCompleted: 9 },
    followers: 142,
    following: 98,
    badgeIds: ["Creative", "Gladiator"]
  },
  {
    username: "lucas_hacks",
    avatar: { hair: "🧢", face: "😀", clothes: "👕" },
    stats: { highScore: 15, gamesPlayed: 8, totalClicks: 90, questsCompleted: 3 },
    followers: 43,
    following: 64,
    badgeIds: ["Novice"]
  }
];

const INITIAL_CREATIONS: DoodleCreation[] = [
  {
    id: 1,
    username: "doodle_king",
    avatar: { hair: "👑", face: "😎", clothes: "🧥" },
    likes: 423,
    highScore: 48,
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    username: "sara_doodles",
    avatar: { hair: "🎀", face: "🧐", clothes: "👗" },
    likes: 88,
    highScore: 22,
    timestamp: "5 hours ago"
  },
  {
    id: 3,
    username: "lucas_hacks",
    avatar: { hair: "🧢", face: "😀", clothes: "👕" },
    likes: 12,
    highScore: 15,
    timestamp: "1 day ago"
  },
  {
    id: 4,
    username: "neon_doodler",
    avatar: { hair: "🎧", face: "👽", clothes: "🥋" },
    likes: 312,
    highScore: 35,
    timestamp: "2 days ago"
  },
  {
    id: 5,
    username: "retro_coder",
    avatar: { hair: "🎩", face: "🤖", clothes: "👔" },
    likes: 54,
    highScore: 19,
    timestamp: "3 days ago"
  },
  {
    id: 6,
    username: "macondo_glider",
    avatar: { hair: "🪶", face: "🦊", clothes: "🎽" },
    likes: 27,
    highScore: 14,
    timestamp: "4 days ago"
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>({
    username: "guest_hacker",
    avatar: { hair: "🎩", face: "🤠", clothes: "👕" },
    stats: { highScore: 0, gamesPlayed: 0, totalClicks: 0, questsCompleted: 0 },
    followers: 12,
    following: 5,
    badgeIds: ["Beginner"]
  });

  const [accounts, setAccounts] = useState<UserProfile[]>(INITIAL_ACCOUNTS);
  const [creations, setCreations] = useState<DoodleCreation[]>(INITIAL_CREATIONS);
  const [likedCreations, setLikedCreations] = useState<number[]>([]);
  const [followingUsers, setFollowingUsers] = useState<string[]>(["doodle_king"]);
  const [tasks, setTasks] = useState<{ text: string; completed: boolean }[]>([]);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("doodle_user");
    const savedAccounts = localStorage.getItem("doodle_accounts");
    const savedCreations = localStorage.getItem("doodle_creations");
    const savedLikes = localStorage.getItem("doodle_liked");
    const savedFollowing = localStorage.getItem("doodle_following");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
    if (savedCreations) setCreations(JSON.parse(savedCreations));
    if (savedLikes) setLikedCreations(JSON.parse(savedLikes));
    if (savedFollowing) setFollowingUsers(JSON.parse(savedFollowing));
  }, []);

  const saveToStorage = (
    u: UserProfile,
    accs: UserProfile[],
    creats: DoodleCreation[],
    likes: number[],
    fol: string[]
  ) => {
    localStorage.setItem("doodle_user", JSON.stringify(u));
    localStorage.setItem("doodle_accounts", JSON.stringify(accs));
    localStorage.setItem("doodle_creations", JSON.stringify(creats));
    localStorage.setItem("doodle_liked", JSON.stringify(likes));
    localStorage.setItem("doodle_following", JSON.stringify(fol));
  };

  const toggleLikeCreation = (id: number) => {
    let nextLikes = [...likedCreations];
    let nextCreations = creations.map(c => {
      if (c.id === id) {
        const isLiked = likedCreations.includes(id);
        if (isLiked) {
          nextLikes = nextLikes.filter(lid => lid !== id);
          return { ...c, likes: c.likes - 1 };
        } else {
          nextLikes.push(id);
          return { ...c, likes: c.likes + 1 };
        }
      }
      return c;
    });

    setLikedCreations(nextLikes);
    setCreations(nextCreations);
    saveToStorage(user, accounts, nextCreations, nextLikes, followingUsers);
  };

  const cloneOutfit = (avatar: UserAvatar) => {
    const nextUser = { ...user, avatar };
    setUser(nextUser);
    saveToStorage(nextUser, accounts, creations, likedCreations, followingUsers);
  };

  const toggleFollowUser = (username: string) => {
    let nextFollowing = [...followingUsers];
    let nextUser = { ...user };

    if (followingUsers.includes(username)) {
      nextFollowing = nextFollowing.filter(name => name !== username);
      nextUser.following = Math.max(0, nextUser.following - 1);
    } else {
      nextFollowing.push(username);
      nextUser.following = nextUser.following + 1;
    }

    setFollowingUsers(nextFollowing);
    setUser(nextUser);
    saveToStorage(nextUser, accounts, creations, likedCreations, nextFollowing);
  };

  const switchProfile = (username: string) => {
    const backupAccounts = accounts.filter(a => a.username !== user.username);
    const existingBackup = backupAccounts.find(a => a.username === username);
    if (!existingBackup) return;

    const nextAccounts = [...backupAccounts, user];
    setUser(existingBackup);
    setAccounts(nextAccounts);
    saveToStorage(existingBackup, nextAccounts, creations, likedCreations, followingUsers);
  };

  const createNewAccount = (username: string) => {
    const formattedName = username.trim().toLowerCase().replace(/\s+/g, "_");
    if (!formattedName) return;
    if (formattedName === user.username || accounts.some(a => a.username === formattedName)) return;

    const newAcc: UserProfile = {
      username: formattedName,
      avatar: { hair: "❌", face: "😀", clothes: "❌" },
      stats: { highScore: 0, gamesPlayed: 0, totalClicks: 0, questsCompleted: 0 },
      followers: 0,
      following: 0,
      badgeIds: ["Beginner"]
    };

    const nextAccounts = [...accounts, user];
    setUser(newAcc);
    setAccounts(nextAccounts);
    saveToStorage(newAcc, nextAccounts, creations, likedCreations, followingUsers);
  };

  const toggleTask = (index: number) => {
    const updated = tasks.map((t, idx) =>
      idx === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    localStorage.setItem("daily_doodle_tasks", JSON.stringify(updated));

    const justCompleted = updated[index].completed;
    if (justCompleted) {
      const nextStats = { ...user.stats, questsCompleted: user.stats.questsCompleted + 1 };
      const nextUser = { ...user, stats: nextStats };
      setUser(nextUser);
      saveToStorage(nextUser, accounts, creations, likedCreations, followingUsers);
    } else {
      const nextStats = { ...user.stats, questsCompleted: Math.max(0, user.stats.questsCompleted - 1) };
      const nextUser = { ...user, stats: nextStats };
      setUser(nextUser);
      saveToStorage(nextUser, accounts, creations, likedCreations, followingUsers);
    }
  };

  const addGamePlayed = (score: number, clicks: number) => {
    const nextStats = {
      highScore: Math.max(user.stats.highScore, score),
      gamesPlayed: user.stats.gamesPlayed + 1,
      totalClicks: user.stats.totalClicks + clicks,
      questsCompleted: user.stats.questsCompleted
    };

    const badges = [...user.badgeIds];
    if (nextStats.highScore >= 15 && !badges.includes("Novice")) badges.push("Novice");
    if (nextStats.highScore >= 25 && !badges.includes("Click Master")) badges.push("Click Master");
    if (nextStats.gamesPlayed >= 5 && !badges.includes("Gladiator")) badges.push("Gladiator");
    if (nextStats.totalClicks >= 100 && !badges.includes("Veteran")) badges.push("Veteran");

    const nextUser = { ...user, stats: nextStats, badgeIds: badges };
    setUser(nextUser);
    saveToStorage(nextUser, accounts, creations, likedCreations, followingUsers);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        accounts,
        setAccounts,
        creations,
        setCreations,
        likedCreations,
        toggleLikeCreation,
        cloneOutfit,
        followingUsers,
        toggleFollowUser,
        switchProfile,
        createNewAccount,
        tasks,
        setTasks,
        toggleTask,
        addGamePlayed,
        showIntro,
        setShowIntro
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
