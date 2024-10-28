import React from "react";

function FeedbackDisplay({ feedback, calculatedTotalMark, finalTotalMark }) {
  console.log("FeedbackDisplay props:", { feedback, calculatedTotalMark, finalTotalMark });

  if (!feedback || !feedback.markingBreakdown) {
    console.log("Feedback or markingBreakdown is missing");
    return <p>No feedback available</p>;
  }

  return (
    <div className="feedback-container">
      <h3 style={{ fontSize: "larger" }}>
        Obtained Score: {finalTotalMark}/{feedback.markingBreakdown.length}
      </h3>
      {finalTotalMark !== feedback.totalMark && (
        <p style={{ color: "orange" }}>
          Note: The calculated total ({finalTotalMark}) differs from the AI's total ({feedback.totalMark}). The calculated total is being displayed.
        </p>
      )}
      <div style={{ overflow: "auto" }}>
        <table className="feedback-table ">
          <thead>
            <tr>
              <th>Criterion</th>
              <th>Description</th>
              <th>Mark</th>
              <th>Explanation</th>
            </tr>
          </thead>
          <tbody>
            {feedback.markingBreakdown.map((item, index) => (
              <tr key={index} style={{ backgroundColor: item.markAwarded ? "#e6ffe6" : "#ffe6e6" }}>
                <td>{item.criterionNumber}</td>
                <td>{item.criterionDescription}</td>
                <td>{item.markAwarded}/1</td>
                <td>
                  <p>{item.explanation}</p>
                  <p>
                    Expected: <code>{item.expectedCode}</code>
                  </p>
                  <p>
                    Your`s : <code>{item.studentCode}</code>
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h5 style={{ marginBottom: "-5px" }}>Suggestions for Improvement:</h5>
      <ul>
        {feedback.suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
      <h5 style={{ marginBottom: "-5px" }}>Overall Comment:</h5>
      <p>{feedback.overallComment}</p>
    </div>
  );
}

export default FeedbackDisplay;
