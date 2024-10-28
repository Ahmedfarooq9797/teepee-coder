import React, { useState, useMemo, useEffect, useRef } from "react";
import QuestionDisplay from "../components/QuestionDisplay";
import CodeEditor from "../components/CodeEditor";
import FeedbackDisplay from "../components/FeedbackDisplay";
import { evaluateCode } from "../services/openaiService";
import "bootstrap/dist/css/bootstrap.min.css";

import QuestionDisplayOld from "../components/QuestionDisplayOld";
import { useNavigate } from "react-router-dom";
const Question = () => {
  const navigate = useNavigate();
  const initialCode = ``;

  const [code, setCode] = useState(initialCode);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  const feedbackRef = useRef(null);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setIsEdited(newCode !== initialCode && newCode.trim() !== "");
  };

  const handleSubmit = async () => {
    if (!isEdited) return;
    setIsLoading(true);
    try {
      const feedbackData = await evaluateCode(code);
      setFeedback(feedbackData);
    } catch (error) {
      console.error("Error evaluating code:", error);
      setFeedback({
        totalMark: 0,
        markingBreakdown: [],
        suggestions: ["An error occurred. Please try again."],
        overallComment: "Unable to evaluate the code due to an error.",
      });
    }
    setIsLoading(false);
  };

  const { calculatedTotalMark, finalTotalMark } = useMemo(() => {
    if (!feedback) return { calculatedTotalMark: 0, finalTotalMark: 0 };

    const calculatedTotalMark = feedback.markingBreakdown.reduce((total, item) => total + item.markAwarded, 0);

    const finalTotalMark = calculatedTotalMark !== feedback.totalMark ? calculatedTotalMark : feedback.totalMark;

    return { calculatedTotalMark, finalTotalMark };
  }, [feedback]);

  useEffect(() => {
    if (feedback && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [feedback]);

  return (
    <div className="app-container">
      <header className="container-fluid app-header py-2" style={{ width: "100%" }}>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className=" text-center flex-grow-1" style={{ marginBottom: "-40px" }}>
            OCR P2 Coding Practice Tool
          </h1>
          {/* <button onClick={() => navigate("/student_question")} style={{ backgroundColor: "blueviolet" }} className="submit-button">
            Browse & Share Questions
          </button> */}
        </div>
      </header>
      <h4 className="text-center" style={{ marginBottom: "26px" }}>
        Practise OCR Paper 2 coding questions with instant AI marking and feedback.
      </h4>
      <p className="text-center" style={{ marginBottom: "32px", fontSize: "larger" }}>
        👉 Teachers, please give the following question a try to see how effectively the AI assesses your response and provides quality feedback.
      </p>
      <main className="app-main">
        <QuestionDisplayOld />

        <section className="code-section">
          <h2 style={{ marginBottom: "16px", fontSize: "1.5rem" }}>Your Solution</h2>
          <CodeEditor initialCode={initialCode} onCodeChange={handleCodeChange} />
          <div className="submit-container">
            <div className="d-flex align-items-center">
              <button
                onClick={handleSubmit}
                style={{ marginTop: "12px", marginBottom: "4px" }}
                className={`submit-button ${!isEdited || isLoading ? "disabled" : ""}`}
                disabled={!isEdited || isLoading}
              >
                <span className="button-text">{isLoading ? "Waiting for AI response..." : "Submit Solution"}</span>
                {!isLoading && <span className="button-icon">→</span>}
              </button>
              {/* <button
                onClick={() => navigate("/student_question")}
                style={{ marginTop: "8px", marginBottom: "4px", marginLeft: "8px", backgroundColor: "blueviolet" }}
                className={`submit-button `}
              >
                Share with class
              </button> */}
            </div>

            <span className="submit-note">Note: AI evaluation may take up to 1 minute.</span>
          </div>
        </section>

        {feedback && (
          <section className="feedback-section" ref={feedbackRef}>
            <h2>Feedback</h2>
            <FeedbackDisplay feedback={feedback} calculatedTotalMark={calculatedTotalMark} finalTotalMark={finalTotalMark} />
            {/* <center>
              <button onClick={() => navigate("/student_question")} style={{ backgroundColor: "blueviolet" }} className={`submit-button `}>
                Share with class
              </button>
            </center> */}
          </section>
        )}

        {/* Add this new div for the powered by text */}
      </main>
      <div className="" style={{ marginTop: "80px" }}>
        <p className="text-center" style={{ fontSize: "24px" }}>
          <b>Want to explore more questions and share them with your students?</b>
        </p>
        <center>
          <button onClick={() => navigate("/student_question")} style={{ backgroundColor: "blueviolet" }} className={`submit-button `}>
            Explore More Questions
          </button>
        </center>
      </div>
      <div className="powered-by">
        Powered by{" "}
        <a href="https://teepee.ai" target="_blank" rel="noopener noreferrer">
          Teepee.ai
        </a>
      </div>
    </div>
  );
};

export default Question;
