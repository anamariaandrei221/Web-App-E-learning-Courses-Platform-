import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function ViewCourseEveryone({
  onLogout,
  token,
  decodedToken = { decodedToken },
}) {
  const [pdfPath, setPdfPath] = useState("");
  const [course, setCourse] = useState({});
  const [tests, setTests] = useState([]);
  const [expandedTestId, setExpandedTestId] = useState(null);

  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { firstName, lastName } = location.state;

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const responseCourse = await axios.get(
          `http://localhost:3001/profesor/courses/details/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const pdfPath = responseCourse.data[0].course_path;
        const baseUrl = "http://localhost:3001/";
        const url = baseUrl + pdfPath.replace(/\\/g, "/");
        setPdfPath(url);
        setCourse(responseCourse.data[0]);

        // Retrieve tests for the course
        const responseTests = await axios.get(
          `http://localhost:3001/profesor/courses/details/tests/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const testsData = responseTests.data;
        setTests(testsData);
      } catch (error) {
        console.log("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, []);

  const handleExpandClick = (testId) => {
    setExpandedTestId((prevTestId) => (prevTestId === testId ? null : testId));
  };

  const renderQuestions = (questions) => {
    return questions.map((question, index) => (
      <div key={index}>
        <Typography variant="body1" component="p">
          {index + 1}. {question.question}
        </Typography>
        <ul>
          {question.answers.map((answer, answerIndex) => (
            <li key={answerIndex}>
              <Typography variant="body1" component="p">
                {answer}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    ));
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
      <div className="div--view--course">
        <div className="course--details">
          <div className="course--autor">
            <span>Clasa {course.classes}</span>
            <span>
              Autor: {firstName} {lastName}
            </span>
          </div>
          <div className="div--course--details--content">
            <div className="course--details--simple">
              <p>{course.title}</p>
              <p>{course.description}</p>
              <div className="tests-container">
                {tests.map((test, index) => (
                  <Card
                    className="test-card"
                    key={test.test_id}
                    style={{ marginBottom: "20px" }}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="h6"
                          component="h2"
                          display={"flex"}
                        >
                          Test {index + 1}
                        </Typography>

                        <IconButton
                          onClick={() => handleExpandClick(test.test_id)}
                        >
                          {expandedTestId === test.test_id ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Box>
                      {expandedTestId === test.test_id && (
                        <div
                          className="questions-container"
                          style={{ marginBottom: "20px" }}
                        >
                          <p>Dificultate: {test.difficulty}</p>
                          {renderQuestions(JSON.parse(test.questions))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {pdfPath && (
              <object
                width="100%"
                height="500"
                data={pdfPath}
                type="application/pdf"
              >
                <p>Unable to display PDF</p>
              </object>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
