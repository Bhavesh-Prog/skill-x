import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage, generateId } from '../../utils/localStorage';
import type { Skill } from '../../types';
import { Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const TeachSkills = () => {
  const { user } = useAuth();
  const [mySkills, setMySkills] = useState<Skill[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'programming',
    price: '',
  });

  useEffect(() => {
    loadMySkills();
  }, []);

  const loadMySkills = () => {
    const allSkills = storage.getSkills();
    const mentorSkills = allSkills.filter((s) => s.mentorId === user?.id);
    setMySkills(mentorSkills);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const skills = storage.getSkills();
    const newSkill: Skill = {
      id: generateId(),
      mentorId: user.id,
      mentorName: user.name,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    skills.push(newSkill);
    storage.setSkills(skills);

    const notifications = storage.getNotifications();
    notifications.push({
      id: generateId(),
      userId: user.id,
      message: `Your skill "${formData.title}" has been submitted for verification`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
    });

    const facultyUsers = storage.getUsers().filter((u) => u.role === 'faculty');
    facultyUsers.forEach((faculty) => {
      notifications.push({
        id: generateId(),
        userId: faculty.id,
        message: `New skill "${formData.title}" by ${user.name} pending verification`,
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
      });
    });

    storage.setNotifications(notifications);

    setFormData({ title: '', description: '', category: 'programming', price: '' });
    setShowForm(false);
    loadMySkills();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            <Clock className="w-4 h-4" />
            <span>Pending</span>
          </span>
        );
      case 'approved':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            <XCircle className="w-4 h-4" />
            <span>Rejected</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Skills</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Skill</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border-2 border-teal-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Submit New Skill
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                placeholder="e.g., Web Development Basics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                placeholder="Describe what you'll teach..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  <option value="programming">Programming</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="marketing">Marketing</option>
                  <option value="photography">Photography</option>
                  <option value="music">Music</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  min="0"
                  step="50"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  placeholder="500"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Submit for Verification
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {mySkills.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No skills yet
          </h3>
          <p className="text-gray-600">
            Add your first skill to start teaching
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {mySkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-lg flex-1">
                  {skill.title}
                </h3>
                {getStatusBadge(skill.status)}
              </div>
              <p className="text-gray-600 mb-4 text-sm">{skill.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <span className="text-xs text-gray-500 uppercase">
                    {skill.category}
                  </span>
                  <p className="text-lg font-bold text-teal-600">
                    ₹{skill.price}
                  </p>
                </div>
                {skill.status === 'rejected' && skill.rejectionReason && (
                  <div className="text-xs text-red-600">
                    Reason: {skill.rejectionReason}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
