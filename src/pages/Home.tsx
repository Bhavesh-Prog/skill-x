import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, Award, ArrowRight } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-teal-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                SkillX
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn. Teach.{' '}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Grow Together.
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with your peers to exchange skills, share knowledge, and build
            your expertise. Faculty-verified mentors ensure quality learning experiences.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Learn from Peers</h3>
            <p className="text-gray-600">
              Access a wide range of skills taught by verified student mentors who
              understand your learning journey.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Share Your Skills</h3>
            <p className="text-gray-600">
              Become a mentor, teach what you know, and earn while helping others grow
              in their educational journey.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Faculty Verified</h3>
            <p className="text-gray-600">
              All mentors are verified by faculty members to ensure quality education
              and authentic skill sharing.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-lg text-teal-50 mb-8 max-w-2xl mx-auto">
            Join thousands of students already exchanging skills and building meaningful
            connections in our community.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-teal-600 font-semibold rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Join SkillX Today
          </button>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-6 h-6 text-teal-600" />
              <span className="font-bold text-gray-900">SkillX</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2024 SkillX. Empowering peer-to-peer learning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
