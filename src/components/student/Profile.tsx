import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../utils/localStorage';
import { User, Award, BookOpen, DollarSign } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    skillsTaught: 0,
    skillsLearned: 0,
    totalEarnings: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    if (!user) return;

    const skills = storage.getSkills();
    const enrollments = storage.getEnrollments();
    const payments = storage.getPayments();

    const skillsTaught = skills.filter(
      (s) => s.mentorId === user.id && s.status === 'approved'
    ).length;

    const skillsLearned = enrollments.filter(
      (e) => e.learnerId === user.id && e.completed
    ).length;

    const totalEarnings = payments
      .filter((p) => p.mentorId === user.id && p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalSpent = payments
      .filter((p) => p.learnerId === user.id && p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    setStats({ skillsTaught, skillsLearned, totalEarnings, totalSpent });
  };

  const canTeach = user?.studentType === 'mentor' || user?.studentType === 'both';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Profile</h2>

      <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{user?.name}</h3>
            <p className="text-teal-100">{user?.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                {user?.role === 'student' ? 'Student' : 'Faculty'}
              </span>
              {user?.studentType && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm capitalize">
                  {user.studentType}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">Learned</span>
            </div>
            <p className="text-3xl font-bold">{stats.skillsLearned}</p>
          </div>

          {canTeach && (
            <>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5" />
                  <span className="text-sm">Teaching</span>
                </div>
                <p className="text-3xl font-bold">{stats.skillsTaught}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-sm">Earned</span>
                </div>
                <p className="text-3xl font-bold">₹{stats.totalEarnings}</p>
              </div>
            </>
          )}

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm">Spent</span>
            </div>
            <p className="text-3xl font-bold">₹{stats.totalSpent}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Account Information
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Member since</span>
            <span className="font-medium text-gray-900">
              {new Date(user?.createdAt || '').toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Account Type</span>
            <span className="font-medium text-gray-900 capitalize">
              {user?.role}
            </span>
          </div>
          {user?.studentType && (
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Learning Mode</span>
              <span className="font-medium text-gray-900 capitalize">
                {user.studentType}
              </span>
            </div>
          )}
          <div className="flex justify-between py-3">
            <span className="text-gray-600">User ID</span>
            <span className="font-medium text-gray-900 font-mono text-sm">
              {user?.id.substring(0, 12)}...
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-200">
        <h3 className="font-bold text-gray-900 mb-2">
          Keep Learning, Keep Growing!
        </h3>
        <p className="text-gray-600 text-sm">
          Your journey on SkillX is making a difference. Continue exploring new
          skills and sharing your knowledge with the community.
        </p>
      </div>
    </div>
  );
};
