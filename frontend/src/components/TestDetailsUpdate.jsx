import React, { useState } from "react";
import { TextField } from "@mui/material";

export default function TestDetailsUpdate({ question }) {
  const [selectedAnswer, setSelectedAnswer] = useState(question.correct_answer);
  const [updatedQuestion, setUpdatedQuestion] = useState(question.question);
  const [updatedAnswers, setUpdatedAnswers] = useState([
    question.answer1,
    question.answer2,
    question.answer3,
    question.answer4,
  ]);

  const handleCheckboxChange = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleQuestionChange = (event) => {
    setUpdatedQuestion(event.target.value);
  };

  const handleAnswerChange = (event, answerIndex) => {
    const updatedAnswersCopy = [...updatedAnswers];
    updatedAnswersCopy[answerIndex] = event.target.value;
    setUpdatedAnswers(updatedAnswersCopy);
  };
  console.log(updatedQuestion, updatedAnswers, selectedAnswer);
  return (
    <div className="div--question--content">
      <div className="question--content">
        <span className="input-label redBorder">Enunț</span>
        <TextField
          type="text"
          value={updatedQuestion}
          size="small"
          multiline
          rows={2}
          fullWidth
          onChange={handleQuestionChange}
        />
      </div>
      <div className="answer--container">
        <span className="input-label redBorder">Răspuns 1</span>
        <TextField
          type="text"
          size="small"
          value={updatedAnswers[0]}
          fullWidth
          onChange={(event) => handleAnswerChange(event, 0)}
        />
        <input
          type="checkbox"
          checked={selectedAnswer === updatedAnswers[0]}
          onChange={() => handleCheckboxChange(updatedAnswers[0])}
        />
      </div>
      <div className="answer--container">
        <span className="input-label redBorder">Răspuns 2</span>
        <TextField
          type="text"
          size="small"
          value={updatedAnswers[1]}
          fullWidth
          onChange={(event) => handleAnswerChange(event, 1)}
        />
        <input
          type="checkbox"
          checked={selectedAnswer === updatedAnswers[1]}
          onChange={() => handleCheckboxChange(updatedAnswers[1])}
        />
      </div>
      <div className="answer--container">
        <span className="input-label redBorder">Răspuns 3</span>
        <TextField
          type="text"
          size="small"
          value={updatedAnswers[2]}
          fullWidth
          onChange={(event) => handleAnswerChange(event, 2)}
        />
        <input
          type="checkbox"
          checked={selectedAnswer === updatedAnswers[2]}
          onChange={() => handleCheckboxChange(updatedAnswers[2])}
        />
      </div>
      <div className="answer--container">
        <span className="input-label redBorder">Răspuns 4</span>
        <TextField
          type="text"
          size="small"
          value={updatedAnswers[3]}
          fullWidth
          onChange={(event) => handleAnswerChange(event, 3)}
        />
        <input
          type="checkbox"
          checked={selectedAnswer === updatedAnswers[3]}
          onChange={() => handleCheckboxChange(updatedAnswers[3])}
        />
      </div>
      <p style={{ fontSize: "10px" }}>* Selectați noul răspuns corect</p>
    </div>
  );
}
