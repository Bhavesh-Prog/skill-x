import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage, generateId } from '../../utils/localStorage';
import { Verification, Skill } from '../../types';
import { Calendar, Plus, CheckCircle, Clock } from 'lucide-react';

export const VerificationSessions = () => {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [approvedSkills, setApprovedSkills] = useState<Skill[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    skillId: '',
    scheduledDate: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allVerifications = storage.getVerifications();
    const myVerifications = allVerifications.filter(
      (v) => v.facultyId === user?.id
    );
    setVerifications(myVerifications);

    const skills = storage.getSkills();
    const approved = skills.filter((s) => s.status === 'approved');
    setApprovedSkills(approved);
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const verifications = storage.getVerifications();
    const skill = approvedSkills.find((s) => s.id === formData.skillId);
    if (!skill) return;

    const newVerification: Verification = {
      id: generateId(),
      skillId: formData.skillId,
      facultyId: user.id,
      facultyName: user.name,
      scheduledDate: formData.scheduledDate,
      completed: false,
    };

    verifications.push(newVerification);
    storage.setVerifications(verifications);

    const notifications = storage.getNotifications();
    notifications.push({
      id: generateId(),
      userId: skill.mentorId,
      message: `Verification session scheduled for "${skill.title}" on ${new Date(
        formData.scheduledDate
      ).toLocaleString()}`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
    });
    storage.setNotifications(notifications);

    setFormData({ skillId: '', scheduledDate: '' });
    setShowForm(false);
    loadData();
  };

  const handleComplete = (verificationId: string, remarks: string) => {
    const allVerifications = storage.getVerifications();
    const updated = allVerifications.map((v) =>
      v.id === verificationId ? { ...v, completed: true, remarks } : v
    );
    storage.setVerifications(updated);
    loadData();
  };

  const getSkillTitle = (skillId: string) => {
    const skill = approvedSkills.find((s) => s.id === skillId);
    return skill?.title || 'Unknown Skill';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Verification Sessions
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Schedule Session</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border-2 border-teal-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Schedule New Session
          </h3>
          <form onSubmit={handleSchedule} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Skill
              </label>
              <select
                value={formData.skillId}
                onChange={(e) =>
                  setFormData({ ...formData, skillId: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              >
                <option value="">Choose a skill...</option>
                {approvedSkills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.title} - by {skill.mentorName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledDate: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Schedule Session
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

      {verifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No sessions scheduled
          </h3>
          <p className="text-gray-600">
            Schedule verification sessions with mentors
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {verifications.map((verification) => (
            <VerificationCard
              key={verification.id}
              verification={verification}
              skillTitle={getSkillTitle(verification.skillId)}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const VerificationCard = ({
  verification,
  skillTitle,
  onComplete,
}: {
  verification: Verification;
  skillTitle: string;
  onComplete: (id: string, remarks: string) => void;
}) => {
  const [remarks, setRemarks] = useState(verification.remarks || '');
  const [showRemarks, setShowRemarks] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg mb-2">
            {skillTitle}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(verification.scheduledDate).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Faculty: {verification.facultyName}
          </p>
        </div>
        {verification.completed ? (
          <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Completed</span>
          </span>
        ) : (
          <span className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            <Clock className="w-4 h-4" />
            <span>Scheduled</span>
          </span>
        )}
      </div>

      {verification.completed && verification.remarks && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Remarks:</p>
          <p className="text-sm text-gray-600">{verification.remarks}</p>
        </div>
      )}

      {!verification.completed && (
        <>
          {showRemarks ? (
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  placeholder="Add notes about the verification session..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    onComplete(verification.id, remarks);
                    setShowRemarks(false);
                  }}
                  className="flex-1 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => setShowRemarks(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowRemarks(true)}
              className="w-full py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              Complete Session
            </button>
          )}
        </>
      )}
    </div>
  );
};
