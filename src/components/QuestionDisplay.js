import React, { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const QuestionDisplay = ({ questionText, index }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const questionId = query.get("question"); // Extract question id from URL
  return (
    <div className="question-display">
      <h2 style={{ marginBottom: "16px ", fontSize: "1.5rem" }}>{questionId === null ? `Question  ${index + 1}` : "Question"}</h2>
      <div dangerouslySetInnerHTML={{ __html: questionText }} />
    </div>
  );
};

export default QuestionDisplay;
