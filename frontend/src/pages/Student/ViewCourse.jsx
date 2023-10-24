import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";

export default function ViewCourse({ onLogout, token, decodedToken }) {
  const [pdfPath, setPdfPath] = useState("");
  const [course, setCourse] = useState({});
  const [tests, setTests] = useState([]);
  const { courseId } = useParams();
  const userId = decodedToken.userId;
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
      } catch (error) {
        console.log("Error fetching course data:", error);
      }
    };

    const fetchTestsData = async () => {
      try {
        const responseTests = await axios.get(
          `http://localhost:3001/student/${userId}/courses/details/tests/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTests(responseTests.data);
      } catch (error) {
        console.log("Error fetching tests data:", error);
      }
    };

    fetchCourseData();
    fetchTestsData();
  }, []);

  const handleStartTest = (testId) => {
    navigate(`/elev/course/${courseId}/start-test/${testId}`, {
      state: { courseId, testId },
    });
  };

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
            </div>

            {tests.length > 0 && (
              <div className="tests--container--preview">
                <h5>Teste</h5>
                {tests.map((test, index) => (
                  <div key={test.test_id} className="test--card--preview">
                    <div className="test--details--card--preview">
                      <p
                        className="test--div--design"
                        style={{
                          backgroundColor: `${getDifficultyColor(
                            test.difficulty
                          )}`,
                        }}
                      >
                        {test.difficulty}
                      </p>
                      <p>Test {index + 1}</p>
                    </div>
                    {test.grade ? (
                      <p style={{ margin: 0 }}>Punctaj: {test.grade}</p>
                    ) : (
                      <Button onClick={() => handleStartTest(test.test_id)}>
                        Start Test
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {pdfPath && (
              <object
                width="100%"
                height="500"
                data={pdfPath}
                type="application/pdf"
                style={{ marginTop: "40px" }}
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
