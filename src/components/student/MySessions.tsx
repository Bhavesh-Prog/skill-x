import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../utils/localStorage';
import { Enrollment } from '../../types';
import { Calendar, CheckCircle, Star, MessageSquare } from 'lucide-react';

export const MySessions = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [feedbackText, setFeedbackText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = () => {
    const allEnrollments = storage.getEnrollments();
    const myEnrollments = allEnrollments.filter(
      (e) => e.learnerId === user?.id
    );
    setEnrollments(myEnrollments);
  };

  const handleComplete = (enrollmentId: string) => {
    const allEnrollments = storage.getEnrollments();
    const updated = allEnrollments.map((e) =>
      e.id === enrollmentId ? { ...e, completed: true } : e
    );
    storage.setEnrollments(updated);
    loadEnrollments();
  };

  const handleFeedback = (enrollmentId: string) => {
    const feedback = feedbackText[enrollmentId];
    if (!feedback) return;

    const allEnrollments = storage.getEnrollments();
    const updated = allEnrollments.map((e) =>
      e.id === enrollmentId ? { ...e, feedback } : e
    );
    storage.setEnrollments(updated);
    setFeedbackText({ ...feedbackText, [enrollmentId]: '' });
    loadEnrollments();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Sessions</h2>

      {enrollments.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No sessions yet
          </h3>
          <p className="text-gray-600">
            Enroll in skills to start your learning journey
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {enrollment.skillTitle}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Mentor: {enrollment.mentorName}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Enrolled on:{' '}
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-teal-600">
                    ₹{enrollment.price}
                  </p>
                  {enrollment.completed ? (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs mt-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs mt-2">
                      <Calendar className="w-3 h-3" />
                      <span>In Progress</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                {!enrollment.completed && (
                  <button
                    onClick={() => handleComplete(enrollment.id)}
                    className="w-full py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                  >
                    Mark as Completed
                  </button>
                )}

                {enrollment.feedback ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Your Feedback
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{enrollment.feedback}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Leave Feedback
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={feedbackText[enrollment.id] || ''}
                        onChange={(e) =>
                          setFeedbackText({
                            ...feedbackText,
                            [enrollment.id]: e.target.value,
                          })
                        }
                        placeholder="Share your experience..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      />
                      <button
                        onClick={() => handleFeedback(enrollment.id)}
                        disabled={!feedbackText[enrollment.id]}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
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
