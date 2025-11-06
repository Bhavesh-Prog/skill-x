import { useState, useEffect } from 'react';
import { storage } from '../../utils/localStorage';
import { Skill, Video } from '../../types';
import { Award, Video as VideoIcon, Play, Search } from 'lucide-react';

export const ApprovedSkills = () => {
  const [approvedSkills, setApprovedSkills] = useState<Skill[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const skills = storage.getSkills();
    const approved = skills.filter((s) => s.status === 'approved');
    setApprovedSkills(approved);

    const allVideos = storage.getVideos();
    setVideos(allVideos);
  };

  const filteredSkills = approvedSkills.filter(
    (skill) =>
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.mentorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSkillVideos = (skillId: string) => {
    return videos.filter((v) => v.skillId === skillId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Approved Skills</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {filteredSkills.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No approved skills yet
          </h3>
          <p className="text-gray-600">
            Skills will appear here once you approve them
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => {
            const skillVideos = getSkillVideos(skill.id);
            return (
              <div
                key={skill.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-32 bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                  <Award className="w-12 h-12 text-white/80" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                    {skill.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    by {skill.mentorName}
                  </p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {skill.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">
                        {skill.category}
                      </span>
                      <p className="text-lg font-bold text-teal-600">
                        ₹{skill.price}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedSkill(skill)}
                      className="flex items-center space-x-1 px-3 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors"
                    >
                      <VideoIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {skillVideos.length}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedSkill && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Videos for {selectedSkill.title}
              </h3>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {getSkillVideos(selectedSkill.id).length === 0 ? (
                <div className="text-center py-12">
                  <VideoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No videos uploaded yet</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {getSkillVideos(selectedSkill.id).map((video) => (
                    <div
                      key={video.id}
                      className="bg-gray-50 rounded-lg overflow-hidden"
                    >
                      <div className="h-32 bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center">
                        <Play className="w-10 h-10 text-white/80" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-500 mb-1">
                          {video.fileName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(video.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
