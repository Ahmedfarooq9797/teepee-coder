import React from 'react';
import { generateQuestion } from '../services/openaiService';

const QuestionGenerator = ({ level, onQuestionGenerated }) => {
  const handleGenerateQuestion = async () => {
    if (level) {
      const question = await generateQuestion(level);
      onQuestionGenerated(question);
    }
  };

  return (
    <div>
      <button onClick={handleGenerateQuestion} disabled={!level}>
        Generate Question
      </button>
    </div>
  );
};

export default QuestionGenerator;

