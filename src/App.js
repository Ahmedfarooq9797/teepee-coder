import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import QuestionPages from "./pages/questionPages";
import Question from "./pages/question";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Default route to /home */}
          <Route path="/" element={<Question />} />

          {/* Redirect to /home if the route is not specified */}
          <Route path="/student_question" element={<QuestionPages />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
