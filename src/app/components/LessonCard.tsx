import { BookOpen, Award, CheckCircle, Lock } from 'lucide-react';

interface LessonCardProps {
  lesson: {
    id: number;
    title: string;
    description: string;
  };
  isCompleted: boolean;
  isNftClaimed: boolean;
  onStartLesson: () => void;
  onClaimNFT: () => void;
}

export function LessonCard({ 
  lesson, 
  isCompleted, 
  isNftClaimed, 
  onStartLesson, 
  onClaimNFT 
}: LessonCardProps) {
  const gradients = [
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600", 
    "from-indigo-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-cyan-500 to-blue-600"
  ];

  const gradient = gradients[lesson.id] || gradients[0];

  return (
    <div className="group bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-gray-900/50">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-3 transition-transform duration-300`}>
          <BookOpen className="w-6 h-6" />
        </div>
        
        <div className="flex items-center space-x-2">
          {isCompleted && (
            <div className="bg-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle className="w-3 h-3 inline mr-1" />
              Completed
            </div>
          )}
          {isNftClaimed && (
            <div className="bg-purple-500/20 text-purple-400 text-xs font-medium px-3 py-1 rounded-full border border-purple-500/30">
              <Award className="w-3 h-3 inline mr-1" />
              NFT Claimed
            </div>
          )}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-emerald-400 transition-colors">
        {lesson.title}
      </h3>
      
      <p className="text-gray-300 mb-6 leading-relaxed">
        {lesson.description}
      </p>
      
      <div className="flex space-x-3">
        {!isCompleted ? (
          <button
            onClick={onStartLesson}
            className="cursor-pointer flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Start Lesson
          </button>
        ) : !isNftClaimed ? (
          <button
            onClick={onClaimNFT}
            className="cursor-pointer flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <Award className="w-4 h-4 inline mr-2" />
            Claim NFT Badge
          </button>
        ) : (
          <button
            disabled
            className="flex-1 bg-gray-700/50 text-gray-400 font-medium py-3 px-4 rounded-xl cursor-not-allowed border border-gray-600/30"
          >
            <Award className="w-4 h-4 inline mr-2" />
            Badge Earned ✓
          </button>
        )}
      </div>
    </div>
  );
}
