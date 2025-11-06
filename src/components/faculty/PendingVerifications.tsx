import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage, generateId } from '../../utils/localStorage';
import type { Skill } from '../../types';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export const PendingVerifications = () => {
  const { user } = useAuth();
  const [pendingSkills, setPendingSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadPendingSkills();
  }, []);

  const loadPendingSkills = () => {
    const skills = storage.getSkills();
    const pending = skills.filter((s) => s.status === 'pending');
    setPendingSkills(pending);
  };

  const handleApprove = (skill: Skill) => {
    const skills = storage.getSkills();
    const updated = skills.map((s) =>
      s.id === skill.id ? { ...s, status: 'approved' as const } : s
    );
    storage.setSkills(updated);

    const notifications = storage.getNotifications();
    notifications.push({
      id: generateId(),
      userId: skill.mentorId,
      message: `Your skill "${skill.title}" has been approved by ${user?.name}!`,
      type: 'success',
      read: false,
      createdAt: new Date().toISOString(),
    });
    storage.setNotifications(notifications);

    loadPendingSkills();
  };

  const handleReject = (skill: Skill) => {
    if (!rejectionReason) {
      alert('Please provide a reason for rejection');
      return;
    }

    const skills = storage.getSkills();
    const updated = skills.map((s) =>
      s.id === skill.id
        ? { ...s, status: 'rejected' as const, rejectionReason }
        : s
    );
    storage.setSkills(updated);

    const notifications = storage.getNotifications();
    notifications.push({
      id: generateId(),
      userId: skill.mentorId,
      message: `Your skill "${skill.title}" was not approved. Reason: ${rejectionReason}`,
      type: 'warning',
      read: false,
      createdAt: new Date().toISOString(),
    });
    storage.setNotifications(notifications);

    setSelectedSkill(null);
    setRejectionReason('');
    loadPendingSkills();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Pending Verifications
      </h2>

      {pendingSkills.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            All caught up!
          </h3>
          <p className="text-gray-600">
            No pending verifications at the moment
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {skill.title}
                    </h3>
                    <span className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                      <Clock className="w-3 h-3" />
                      <span>Pending</span>
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{skill.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Mentor: {skill.mentorName}</span>
                    <span>•</span>
                    <span className="capitalize">{skill.category}</span>
                    <span>•</span>
                    <span className="font-semibold text-teal-600">
                      ₹{skill.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Submitted: {new Date(skill.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedSkill?.id === skill.id ? (
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Rejection
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      placeholder="Explain why this skill cannot be approved..."
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleReject(skill)}
                      className="flex-1 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSkill(null);
                        setRejectionReason('');
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-3 border-t border-gray-200 pt-4">
                  <button
                    onClick={() => handleApprove(skill)}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => setSelectedSkill(skill)}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
