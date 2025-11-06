import { useState, useEffect } from 'react';
import { storage } from '../../utils/localStorage';
import { Users, BookOpen, Award, DollarSign, TrendingUp } from 'lucide-react';

export const Reports = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMentors: 0,
    totalSkills: 0,
    approvedSkills: 0,
    pendingSkills: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    totalVideos: 0,
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const users = storage.getUsers();
    const skills = storage.getSkills();
    const enrollments = storage.getEnrollments();
    const payments = storage.getPayments();
    const videos = storage.getVideos();

    const students = users.filter((u) => u.role === 'student');
    const mentors = students.filter(
      (u) => u.studentType === 'mentor' || u.studentType === 'both'
    );

    const totalRevenue = payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    setStats({
      totalStudents: students.length,
      totalMentors: mentors.length,
      totalSkills: skills.length,
      approvedSkills: skills.filter((s) => s.status === 'approved').length,
      pendingSkills: skills.filter((s) => s.status === 'pending').length,
      totalEnrollments: enrollments.length,
      totalRevenue,
      totalVideos: videos.length,
    });
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    bgColor,
  }: {
    title: string;
    value: number | string;
    icon: any;
    color: string;
    bgColor: string;
  }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          title="Active Mentors"
          value={stats.totalMentors}
          icon={Award}
          color="text-teal-600"
          bgColor="bg-teal-100"
        />
        <StatCard
          title="Approved Skills"
          value={stats.approvedSkills}
          icon={BookOpen}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue}`}
          icon={DollarSign}
          color="text-emerald-600"
          bgColor="bg-emerald-100"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Skill Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600">Total Skills Submitted</span>
              <span className="text-2xl font-bold text-gray-900">
                {stats.totalSkills}
              </span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600">Approved Skills</span>
              <span className="text-2xl font-bold text-green-600">
                {stats.approvedSkills}
              </span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600">Pending Verification</span>
              <span className="text-2xl font-bold text-yellow-600">
                {stats.pendingSkills}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Approval Rate</span>
              <span className="text-2xl font-bold text-teal-600">
                {stats.totalSkills > 0
                  ? Math.round((stats.approvedSkills / stats.totalSkills) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Engagement Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600">Total Enrollments</span>
              <span className="text-2xl font-bold text-gray-900">
                {stats.totalEnrollments}
              </span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600">Videos Uploaded</span>
              <span className="text-2xl font-bold text-purple-600">
                {stats.totalVideos}
              </span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600">Avg. Videos per Skill</span>
              <span className="text-2xl font-bold text-blue-600">
                {stats.approvedSkills > 0
                  ? (stats.totalVideos / stats.approvedSkills).toFixed(1)
                  : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Avg. Price per Skill</span>
              <span className="text-2xl font-bold text-emerald-600">
                ₹
                {stats.totalEnrollments > 0
                  ? Math.round(stats.totalRevenue / stats.totalEnrollments)
                  : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">Platform Health</h3>
        <p className="text-teal-100 mb-6">
          The SkillX platform is growing! Keep up the great work in verifying
          quality skills and supporting our mentor community.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-teal-100 text-sm mb-1">User Satisfaction</p>
            <p className="text-3xl font-bold">98%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-teal-100 text-sm mb-1">Platform Activity</p>
            <p className="text-3xl font-bold">High</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-teal-100 text-sm mb-1">Growth Rate</p>
            <p className="text-3xl font-bold">+24%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
