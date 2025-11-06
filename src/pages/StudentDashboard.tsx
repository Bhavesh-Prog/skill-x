import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  Video,
  Calendar,
  Bell,
  User,
  LogOut,
  Plus,
} from 'lucide-react';
import { LearnSkills } from '../components/student/LearnSkills';
import { TeachSkills } from '../components/student/TeachSkills';
import { VideoUpload } from '../components/student/VideoUpload';
import { MySessions } from '../components/student/MySessions';
import { Notifications } from '../components/student/Notifications';
import { Profile } from '../components/student/Profile';

type Tab = 'learn' | 'teach' | 'videos' | 'sessions' | 'notifications' | 'profile';

export const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('learn');

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const canTeach = user?.studentType === 'mentor' || user?.studentType === 'both';

  const tabs = [
    { id: 'learn' as Tab, label: 'Learn Skills', icon: BookOpen },
    ...(canTeach ? [{ id: 'teach' as Tab, label: 'Teach Skills', icon: Plus }] : []),
    ...(canTeach ? [{ id: 'videos' as Tab, label: 'Videos', icon: Video }] : []),
    { id: 'sessions' as Tab, label: 'My Sessions', icon: Calendar },
    { id: 'notifications' as Tab, label: 'Notifications', icon: Bell },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-teal-600" />
              <div>
                <span className="text-xl font-bold text-gray-900">SkillX</span>
                <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'learn' && <LearnSkills />}
            {activeTab === 'teach' && <TeachSkills />}
            {activeTab === 'videos' && <VideoUpload />}
            {activeTab === 'sessions' && <MySessions />}
            {activeTab === 'notifications' && <Notifications />}
            {activeTab === 'profile' && <Profile />}
          </div>
        </div>
      </div>
    </div>
  );
};
