import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage, generateId } from '../../utils/localStorage';
import { Skill, Enrollment, Payment, Notification } from '../../types';
import { PaymentModal } from '../PaymentModal';
import { Search, Filter, Star, Play } from 'lucide-react';

export const LearnSkills = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  useEffect(() => {
    filterSkills();
  }, [skills, searchQuery, selectedCategory]);

  const loadSkills = () => {
    const allSkills = storage.getSkills();
    const approvedSkills = allSkills.filter((s) => s.status === 'approved');
    setSkills(approvedSkills);
  };

  const filterSkills = () => {
    let filtered = skills;

    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    setFilteredSkills(filtered);
  };

  const categories = ['all', ...new Set(skills.map((s) => s.category))];

  const handleEnroll = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  const handlePaymentSuccess = () => {
    if (!selectedSkill || !user) return;

    const enrollments = storage.getEnrollments();
    const newEnrollment: Enrollment = {
      id: generateId(),
      learnerId: user.id,
      learnerName: user.name,
      mentorId: selectedSkill.mentorId,
      mentorName: selectedSkill.mentorName,
      skillId: selectedSkill.id,
      skillTitle: selectedSkill.title,
      price: selectedSkill.price,
      enrolledAt: new Date().toISOString(),
      completed: false,
    };
    enrollments.push(newEnrollment);
    storage.setEnrollments(enrollments);

    const payments = storage.getPayments();
    const newPayment: Payment = {
      id: generateId(),
      learnerId: user.id,
      mentorId: selectedSkill.mentorId,
      skillId: selectedSkill.id,
      amount: selectedSkill.price,
      status: 'completed',
      transactionDate: new Date().toISOString(),
    };
    payments.push(newPayment);
    storage.setPayments(payments);

    const notifications = storage.getNotifications();
    notifications.push({
      id: generateId(),
      userId: user.id,
      message: `Successfully enrolled in "${selectedSkill.title}"`,
      type: 'success',
      read: false,
      createdAt: new Date().toISOString(),
    });
    notifications.push({
      id: generateId(),
      userId: selectedSkill.mentorId,
      message: `${user.name} enrolled in your skill "${selectedSkill.title}"`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
    });
    storage.setNotifications(notifications);

    setSelectedSkill(null);
  };

  const isEnrolled = (skillId: string) => {
    const enrollments = storage.getEnrollments();
    return enrollments.some(
      (e) => e.skillId === skillId && e.learnerId === user?.id
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredSkills.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No skills found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100"
            >
              <div className="h-32 bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <Play className="w-12 h-12 text-white/80" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                      {skill.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      by {skill.mentorName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-yellow-700">
                      4.8
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {skill.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">Price</span>
                    <p className="text-xl font-bold text-teal-600">
                      ₹{skill.price}
                    </p>
                  </div>
                  {isEnrolled(skill.id) ? (
                    <button
                      disabled
                      className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      Enrolled
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(skill)}
                      className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSkill && (
        <PaymentModal
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
