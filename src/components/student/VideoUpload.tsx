import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage, generateId } from '../../utils/localStorage';
import type { Skill, Video } from '../../types';
import { Upload, Play, FileVideo, AlertCircle } from 'lucide-react';

export const VideoUpload = () => {
  const { user } = useAuth();
  const [approvedSkills, setApprovedSkills] = useState<Skill[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allSkills = storage.getSkills();
    const myApprovedSkills = allSkills.filter(
      (s) => s.mentorId === user?.id && s.status === 'approved'
    );
    setApprovedSkills(myApprovedSkills);

    const allVideos = storage.getVideos();
    const myVideos = allVideos.filter((v) => v.mentorId === user?.id);
    setVideos(myVideos);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSkillId || !videoTitle || !user) return;

    setUploading(true);

    setTimeout(() => {
      const videos = storage.getVideos();
      const newVideo: Video = {
        id: generateId(),
        skillId: selectedSkillId,
        mentorId: user.id,
        title: videoTitle,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
      };

      videos.push(newVideo);
      storage.setVideos(videos);

      setVideoTitle('');
      setSelectedSkillId('');
      setUploading(false);
      loadData();

      const input = e.target;
      input.value = '';
    }, 1500);
  };

  const getSkillTitle = (skillId: string) => {
    const skill = approvedSkills.find((s) => s.id === skillId);
    return skill?.title || 'Unknown Skill';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Video Upload</h2>

      {approvedSkills.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No approved skills yet
          </h3>
          <p className="text-gray-600">
            Submit a skill and get it verified by faculty to upload videos
          </p>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border-2 border-teal-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Upload New Video
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Skill
                </label>
                <select
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  <option value="">Choose a skill...</option>
                  {approvedSkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="e.g., Introduction to HTML"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Video File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    disabled={!selectedSkillId || !videoTitle || uploading}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-50 file:text-teal-700 file:font-medium hover:file:bg-teal-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Upload className="w-5 h-5 text-teal-600 animate-bounce" />
                        <span className="text-teal-600 font-medium">
                          Uploading...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: MP4, AVI, MOV, WMV
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              My Videos ({videos.length})
            </h3>
            {videos.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <FileVideo className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No videos uploaded yet</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-40 bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                      <Play className="w-16 h-16 text-white/80" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                        {video.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {getSkillTitle(video.skillId)}
                      </p>
                      <p className="text-xs text-gray-500">
                        File: {video.fileName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(video.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
