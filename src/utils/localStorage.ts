import type {
  User,
  Skill,
  Video,
  Enrollment,
  Payment,
  Verification,
  Notification,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'skillx_users',
  SKILLS: 'skillx_skills',
  VIDEOS: 'skillx_videos',
  ENROLLMENTS: 'skillx_enrollments',
  PAYMENTS: 'skillx_payments',
  VERIFICATIONS: 'skillx_verifications',
  NOTIFICATIONS: 'skillx_notifications',
  CURRENT_USER: 'skillx_current_user',
};

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  setUsers: (users: User[]): void => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getSkills: (): Skill[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SKILLS);
    return data ? JSON.parse(data) : [];
  },

  setSkills: (skills: Skill[]): void => {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  },

  getVideos: (): Video[] => {
    const data = localStorage.getItem(STORAGE_KEYS.VIDEOS);
    return data ? JSON.parse(data) : [];
  },

  setVideos: (videos: Video[]): void => {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  },

  getEnrollments: (): Enrollment[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ENROLLMENTS);
    return data ? JSON.parse(data) : [];
  },

  setEnrollments: (enrollments: Enrollment[]): void => {
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
  },

  getPayments: (): Payment[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return data ? JSON.parse(data) : [];
  },

  setPayments: (payments: Payment[]): void => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  },

  getVerifications: (): Verification[] => {
    const data = localStorage.getItem(STORAGE_KEYS.VERIFICATIONS);
    return data ? JSON.parse(data) : [];
  },

  setVerifications: (verifications: Verification[]): void => {
    localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(verifications));
  },

  getNotifications: (): Notification[] => {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  },

  setNotifications: (notifications: Notification[]): void => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
