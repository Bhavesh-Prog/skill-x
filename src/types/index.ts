export type UserRole = 'student' | 'faculty';
export type StudentType = 'learner' | 'mentor' | 'both';
export type SkillStatus = 'pending' | 'approved' | 'rejected';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  studentType?: StudentType;
  createdAt: string;
}

export interface Skill {
  id: string;
  mentorId: string;
  mentorName: string;
  title: string;
  description: string;
  category: string;
  price: number;
  status: SkillStatus;
  createdAt: string;
  rejectionReason?: string;
}

export interface Video {
  id: string;
  skillId: string;
  mentorId: string;
  title: string;
  fileName: string;
  uploadedAt: string;
}

export interface Enrollment {
  id: string;
  learnerId: string;
  learnerName: string;
  mentorId: string;
  mentorName: string;
  skillId: string;
  skillTitle: string;
  price: number;
  enrolledAt: string;
  completed: boolean;
  feedback?: string;
}

export interface Payment {
  id: string;
  learnerId: string;
  mentorId: string;
  skillId: string;
  amount: number;
  status: PaymentStatus;
  transactionDate: string;
}

export interface Verification {
  id: string;
  skillId: string;
  facultyId: string;
  facultyName: string;
  scheduledDate: string;
  completed: boolean;
  remarks?: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  createdAt: string;
}
