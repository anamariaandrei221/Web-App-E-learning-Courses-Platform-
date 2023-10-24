import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import TestDetailsUpdate from "../components/TestDetailsUpdate";
import Modal from "../components/Modal";
export default function ViewTestPage({ onLogout, token, decodedToken }) {
  const [questions, setQuestions] = useState([]);
  const [courseName, setCourseName] = useState();
  const { testId } = useParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleDeleteTest = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/profesor/test/delete/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Test șters cu succes!");
    } catch (error) {
      console.log("Error deleting test:", error);
    }
  };

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
        setCourseName(response.data[0].courseTitle);
        setQuestions(testQuestions);
      } catch (error) {
        console.log("Error fetching test questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleLogout = () => {
    onLogout();
  };
  const closeModal = () => {
    setMessage("");
    navigate("/profesor/teste");
  };

  return (
    <div className="div--all">
      <Navbar
        pages={["cursuri", "teste", "statistici", "alte cursuri"]}
        onLogout={handleLogout}
        role="profesor"
        user={decodedToken}
        token={token}
      />
      <div className="div--view--test">
        <div className="course--details">
          <div className={`test--details--buttons `}>
            <p>{courseName}</p>
            <div>
              <div>
                <IconButton onClick={handleDeleteTest}>
                  <DeleteIcon style={{ color: "white" }} />
                </IconButton>
              </div>
            </div>
          </div>
          <div className="div--test--details--content--2">
            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="div--question">
                <div className="question--header">
                  <p> Întrebarea {questionIndex + 1}</p>
                </div>

                <div className="div--question--content">
                  <p>
                    <span className={`input-label `}>Enunț</span>
                    {question.question}
                  </p>
                  <p>
                    <span className={`input-label `}>Răspuns 1</span>
                    {question.answer1}
                  </p>
                  <p>
                    <span className={`input-label`}>Răspuns 2</span>
                    {question.answer2}
                  </p>
                  <p>
                    <span className={`input-label`}>Răspuns 3</span>
                    {question.answer3}
                  </p>
                  <p>
                    <span className={`input-label`}>Răspuns 4</span>
                    {question.answer4}
                  </p>
                  <p>
                    <span className={`input-label `}>Răspuns corect</span>
                    {question.correct_answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {message && <Modal message={message} onClose={closeModal}></Modal>}
    </div>
  );
}
