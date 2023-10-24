import React, { useState } from "react";
import Navbar from "../components/Navbar";
import TextField from "@mui/material/TextField";
import {
  Button,
  IconButton,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import QuestionInput from "../components/QuestionInput";
import AddIcon from "@mui/icons-material/Add";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../components/Modal";
import Radio from "@mui/material/Radio";
export default function AddTestPage({ onLogout, token, decodedToken }) {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([
    {
      question: "",
      answers: ["", "", "", ""],
      correctAnswer: 0,
    },
  ]);
  const [difficulty, setDifficulty] = useState("usor");
  const { courseId } = useParams();

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        question: "",
        answers: ["", "", "", ""],
        correctAnswer: 0,
      },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, i) => i !== index)
    );
  };

  const handleQuestionChange = (index, question) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].question = question;
      return updatedQuestions;
    });
  };

  const handleAnswerChange = (index, answerIndex, answer) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].answers[answerIndex] = answer;
      return updatedQuestions;
    });
  };

  const handleCheckboxChange = (index, answerIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].correctAnswer = answerIndex;
      return updatedQuestions;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = questions.map((question) => ({
      course_id: courseId,
      question: question.question,
      answers: question.answers,
      correct_answer: question.correctAnswer,
      difficulty: difficulty,
    }));

    try {
      const response = await axios.post(
        "http://localhost:3001/profesor/courses/add-test",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Test adăugat cu succes!"); // Handle the response as needed
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setMessage("");
    navigate(`/profesor/teste`);
  };
  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.name);
  };

  return (
    <div className="div--all">
      <Navbar
        pages={["cursuri", "teste", "statistici", "alte cursuri"]}
        onLogout={onLogout}
        role="profesor"
        user={decodedToken}
        token={token}
      />

      <div className="div--center">
        <div className="add--questions">
          <h4>Adăugare test</h4>

          <form className="form--add--courses" onSubmit={handleSubmit}>
            <div>
              <FormControlLabel
                control={
                  <Radio
                    checked={difficulty === "usor"}
                    onChange={handleDifficultyChange}
                    name="usor"
                  />
                }
                label="Usor"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={difficulty === "mediu"}
                    onChange={handleDifficultyChange}
                    name="mediu"
                  />
                }
                label="Mediu"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={difficulty === "greu"}
                    onChange={handleDifficultyChange}
                    name="greu"
                  />
                }
                label="Greu"
              />
            </div>
            {questions.map((question, index) => (
              <QuestionInput
                key={index}
                number={index + 1}
                question={question.question}
                answers={question.answers}
                correctAnswer={question.correctAnswer}
                onQuestionChange={(question) =>
                  handleQuestionChange(index, question)
                }
                onAnswerChange={(answerIndex, answer) =>
                  handleAnswerChange(index, answerIndex, answer)
                }
                onCheckboxChange={(answerIndex) =>
                  handleCheckboxChange(index, answerIndex)
                }
                onDelete={() => handleDeleteQuestion(index)}
              />
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
              size="small"
            >
              Adaugă o întrebare
            </Button>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              <Button
                variant="contained"
                size="large"
                type="submit"
                style={{ width: "150px" }}
              >
                Adaugă
              </Button>
            </div>
          </form>
        </div>
      </div>
      {message && <Modal message={message} onClose={closeModal}></Modal>}
    </div>
  );
}
