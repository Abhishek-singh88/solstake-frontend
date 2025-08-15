import { useState } from 'react';

interface LessonModalProps {
  lesson: {
    title: string;
    content: string;
    questions: Array<{
      question: string;
      options: string[];
      correct: number;
    }>;
  };
  onClose: () => void;
  onComplete: () => void;
}

export function LessonModal({ lesson, onClose, onComplete }: LessonModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(-1); // Start at -1 to show content first
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    Array(lesson.questions.length).fill(-1)
  );
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < lesson.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return lesson.questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correct ? 1 : 0);
    }, 0);
  };

  const handleComplete = () => {
    const score = calculateScore();
    const passingScore = Math.ceil(lesson.questions.length * 0.7);
    
    if (score >= passingScore) {
      onComplete();
    } else {
      alert('You need at least 70% to pass. Please try again!');
      setCurrentQuestion(-1);
      setSelectedAnswers(Array(lesson.questions.length).fill(-1));
      setShowResults(false);
    }
  };

  const startQuiz = () => {
    setCurrentQuestion(0);
  };

  // Prevent modal from closing when clicking inside
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="custom-modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="custom-modal-dialog bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
              type="button"
            >
              ×
            </button>
          </div>

          {!showResults ? (
            <>
              {/* Show lesson content */}
              {currentQuestion === -1 && (
                <div className="mb-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-6">{lesson.content}</p>
                  </div>
                  <button
                    onClick={startQuiz}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    type="button"
                  >
                    Start Quiz
                  </button>
                </div>
              )}

              {/* Show quiz questions */}
              {currentQuestion >= 0 && (
                <div>
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">
                      Question {currentQuestion + 1} of {lesson.questions.length}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-4">
                    {lesson.questions[currentQuestion].question}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    {lesson.questions[currentQuestion].options.map((option, index) => (
                      <div
                        key={`${currentQuestion}-${index}`}
                        className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <input
                          type="radio"
                          id={`quiz-q${currentQuestion}-opt${index}`}
                          name={`quiz-question-${currentQuestion}`}
                          value={index}
                          checked={selectedAnswers[currentQuestion] === index}
                          onChange={() => handleAnswerSelect(index)}
                          className="text-blue-600 cursor-pointer"
                        />
                        <label 
                          htmlFor={`quiz-q${currentQuestion}-opt${index}`}
                          className="cursor-pointer flex-1"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleNext}
                    disabled={selectedAnswers[currentQuestion] === -1}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
                    type="button"
                  >
                    {currentQuestion === lesson.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Quiz Results</h3>
              <p className="text-lg mb-6">
                You scored {calculateScore()} out of {lesson.questions.length}
              </p>
              
              {calculateScore() >= Math.ceil(lesson.questions.length * 0.7) ? (
                <div>
                  <p className="text-green-600 font-medium mb-4">
                    Congratulations! You passed the quiz.
                  </p>
                  <button
                    onClick={handleComplete}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                    type="button"
                  >
                    Complete Lesson
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-red-600 font-medium mb-4">
                    You need at least 70% to pass. Please try again!
                  </p>
                  <button
                    onClick={() => {
                      setCurrentQuestion(-1);
                      setSelectedAnswers(Array(lesson.questions.length).fill(-1));
                      setShowResults(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                    type="button"
                  >
                    Retry Quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
