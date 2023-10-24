import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function StudentTestPage({ onLogout, token, decodedToken }) {
  const testId = useParams().testId;
  const courseId = useParams().courseId;
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60 * 60); // 1 hour in seconds
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Track selected answers
  const [showResults, setShowResults] = useState(false); // Track if results should be shown
  const [result, setResult] = useState(null);
  const [testSubmitted, setTestSubmitted] = useState(false);

  let interval;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/profesor/test/getbyid/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const testQuestions = response.data;

        setTest(testQuestions);
      } catch (error) {
        console.log("Error fetching test questions:", error);
      }
    };

    fetchQuestions();
    return () => {
      clearInterval(interval);
    };
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "usor":
        return "green";
      case "mediu":
        return "rgb(255, 102, 0)";
      case "greu":
        return "red";
      default:
        return "black";
    }
  };

  const startTest = () => {
    setTestStarted(true);
    // Start the timer
    interval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    // Stop the timer after 1 hour
    setTimeout(() => {
      clearInterval(interval);

      setShowResults(true);
    }, 60 * 60 * 1000); // 1 hour in milliseconds
  };

  const stopTest = () => {
    setTestStarted(false);
  };

  const handleAnswerChange = (questionIndex, answerValue) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answerValue,
    }));
  };

  const submitTest = async () => {
    let score = 0;
    const totalQuestions = test.length;

    for (let i = 0; i < totalQuestions; i++) {
      const selectedAnswer = selectedAnswers[i];
      const correctAnswer = test[i].correct_answer;

      if (selectedAnswer === correctAnswer) {
        score++;
      }
    }

    const result = ((score / totalQuestions) * 100).toFixed(2);

    // Display the result
    setShowResults(true);
    setResult(result);

    try {
      // Insert the result, course ID, and user ID into the database
      const resultResponse = await axios.post(
        "http://localhost:3001/student/result",
        {
          courseId: courseId,
          userId: decodedToken.userId,
          result: result,
          testId: test[0].test_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Result inserted into the database:", resultResponse.data);

      // Insert user answers into the database
      for (let i = 0; i < totalQuestions; i++) {
        const selectedAnswer = selectedAnswers[i];
        const questionId = test[i].id;

        const userAnswerResponse = await axios.post(
          "http://localhost:3001/student/user_answer",
          {
            userId: decodedToken.userId,
            courseId: courseId,
            questionId: questionId,
            testId: test[0].test_id,
            selectedAnswer: selectedAnswer,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(
        //   "User answer inserted into the database:",
        //   userAnswerResponse.data
        // );
      }
      setTestSubmitted(true);
      clearInterval(interval);
    } catch (error) {
      console.log(
        "Error inserting result or user answers into the database:",
        error
      );
    }
  };

  return (
    <div className="div--all">
      <Navbar
        pages={["istoric", "cursuri"]}
        onLogout={onLogout}
        role="elev"
        user={decodedToken}
        token={token}
      />
      <div className="div--view--course">
        <div className="course--details">
          <div className="test--details">
            {test && test.length > 0 && (
              <div className="course--autor--details">
                <span
                  className="test--div--design"
                  style={{
                    backgroundColor: `${getDifficultyColor(
                      test[0].difficulty
                    )}`,
                    marginRight: "10px",
                  }}
                >
                  {test[0].difficulty}
                </span>
                <span>{test[0].courseTitle}</span>
              </div>
            )}
            {testStarted && (
              <div>
                Timp rămas: {Math.floor(remainingTime / 60)}:
                {remainingTime % 60 < 10 ? "0" : ""}
                {remainingTime % 60}
              </div>
            )}
          </div>
          <div className="div--test--details--content">
            {!testStarted && Object.keys(selectedAnswers).length === 0 && (
              <div className="test--before--start">
                <p>
                  Testul conține {test && test.length} întrebări, cu 4 variante
                  de răspuns, timp de lucru o oră
                </p>
                <Button variant="contained" onClick={startTest}>
                  Începe testul
                </Button>
              </div>
            )}
            {testStarted && (
              <div className="test">
                {test.map((question, index) => (
                  <div key={index} className="question">
                    <p>
                      {index + 1}. {question.question}
                    </p>
                    <div className="question--answers">
                      <input
                        type="radio"
                        name={`answer-${index}`}
                        id={`answer-${index}-1`}
                        checked={selectedAnswers[index] === question.answer1}
                        onChange={() =>
                          handleAnswerChange(index, question.answer1)
                        }
                      />
                      <label htmlFor={`answer-${index}-1`}>
                        {question.answer1}
                      </label>
                    </div>
                    <div className="question--answers">
                      <input
                        type="radio"
                        name={`answer-${index}`}
                        id={`answer-${index}-2`}
                        checked={selectedAnswers[index] === question.answer2}
                        onChange={() =>
                          handleAnswerChange(index, question.answer2)
                        }
                      />
                      <label htmlFor={`answer-${index}-2`}>
                        {question.answer2}
                      </label>
                    </div>
                    <div className="question--answers">
                      <input
                        type="radio"
                        name={`answer-${index}`}
                        id={`answer-${index}-3`}
                        checked={selectedAnswers[index] === question.answer3}
                        onChange={() =>
                          handleAnswerChange(index, question.answer3)
                        }
                      />
                      <label htmlFor={`answer-${index}-3`}>
                        {question.answer3}
                      </label>
                    </div>
                    <div className="question--answers">
                      <input
                        type="radio"
                        name={`answer-${index}`}
                        id={`answer-${index}-4`}
                        checked={selectedAnswers[index] === question.answer4}
                        onChange={() =>
                          handleAnswerChange(index, question.answer4)
                        }
                      />
                      <label htmlFor={`answer-${index}-4`}>
                        {question.answer4}
                      </label>
                    </div>
                  </div>
                ))}
                <Button variant="contained" onClick={stopTest}>
                  Finalizare
                </Button>
              </div>
            )}
            {!testStarted &&
              Object.keys(selectedAnswers).length > 0 &&
              !testSubmitted && (
                <div className="answers--selected">
                  <div>
                    <p style={{ fontWeight: "bold" }}>Răspunsurile tale:</p>
                    {test.map((question, index) => (
                      <div key={index} className="question">
                        <p>
                          {index + 1}. {question.question}
                        </p>

                        {selectedAnswers[index] !== undefined ? (
                          <p>{selectedAnswers[index]}</p>
                        ) : (
                          <p style={{ color: "red" }}>Alege un răspuns!</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="test--pause--buttons">
                    <Button
                      variant="contained"
                      onClick={() => setTestStarted(true)}
                    >
                      Înapoi
                    </Button>{" "}
                    <Button variant="contained" onClick={submitTest}>
                      Submit
                    </Button>
                  </div>
                </div>
              )}

            {showResults && testSubmitted && (
              <div className="result--section">
                <p style={{ fontWeight: "bold", textAlign: "center" }}>
                  Punctaj: {result}
                </p>
                <div className="answers--selected">
                  <div>
                    <p style={{ fontWeight: "bold" }}>Răspunsurile tale:</p>
                  </div>
                  {test.map((question, index) => (
                    <div key={index} className="question--final">
                      <p>
                        {index + 1}. {question.question}
                      </p>
                      <div className="question--answers--final">
                        <p
                          className={
                            question.answer1 === question.correct_answer &&
                            question.answer1 === selectedAnswers[index]
                              ? "green"
                              : question.answer1 === selectedAnswers[index] &&
                                question.answer1 !== question.correct_answer
                              ? "red"
                              : question.answer1 === question.correct_answer &&
                                question.answer1 !== selectedAnswers[index]
                              ? "green"
                              : ""
                          }
                        >
                          {question.answer1}
                        </p>
                        <p
                          className={
                            question.answer2 === question.correct_answer &&
                            question.answer2 === selectedAnswers[index]
                              ? "green"
                              : question.answer2 === selectedAnswers[index] &&
                                question.answer2 !== question.correct_answer
                              ? "red"
                              : question.answer2 === question.correct_answer &&
                                question.answer2 !== selectedAnswers[index]
                              ? "green"
                              : ""
                          }
                        >
                          {question.answer2}
                          {/* Add text and icons similar to above */}
                        </p>
                        <p
                          className={
                            question.answer3 === question.correct_answer &&
                            question.answer3 === selectedAnswers[index]
                              ? "green"
                              : question.answer3 === selectedAnswers[index] &&
                                question.answer3 !== question.correct_answer
                              ? "red"
                              : question.answer3 === question.correct_answer &&
                                question.answer3 !== selectedAnswers[index]
                              ? "green"
                              : ""
                          }
                        >
                          {question.answer3}
                          {/* Add text and icons similar to above */}
                        </p>
                        <p
                          className={
                            question.answer4 === question.correct_answer &&
                            question.answer4 === selectedAnswers[index]
                              ? "green"
                              : question.answer4 === selectedAnswers[index] &&
                                question.answer4 !== question.correct_answer
                              ? "red"
                              : question.answer4 === question.correct_answer &&
                                question.answer4 !== selectedAnswers[index]
                              ? "green"
                              : ""
                          }
                        >
                          {question.answer4}
                          {/* Add text and icons similar to above */}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
