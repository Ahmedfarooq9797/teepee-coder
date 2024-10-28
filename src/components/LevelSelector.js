import React from 'react';

const LevelSelector = ({ onLevelSelect }) => {
  return (
    <div>
      <h2>Select Difficulty Level</h2>
      <select onChange={(e) => onLevelSelect(e.target.value)}>
        <option value="">Select a level</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="exam">Exam Level</option>
      </select>
    </div>
  );
};

export default LevelSelector;

