import React from "react";

const QuestionDisplayOld = () => {
  return (
    <div className="question-display">
      <h2 style={{ marginBottom: "16px", fontSize: "1.5rem" }}>Exam Question</h2>
      <p>Write an algorithm to perform the following steps:</p>
      <ol style={{ lineHeight: "1.8", fontSize: "16px" }}>
        <li>Ask the user to input the quantity of numbers they want to enter and read this value as input.</li>
        <li>Repeatedly take a number as input until the quantity of numbers the user has specified has been entered.</li>
        <li>Calculate and output the total of these numbers.</li>
        <li>Calculate and output the average of these numbers.</li>
      </ol>
    </div>
  );
};

export default QuestionDisplayOld;
