import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import Card from "../../components/Card";
import { useNavigate } from "react-router-dom";
export default function Student({ onLogout, token, decodedToken }) {
  const [accessedCourses, setAccessedCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const userId = decodedToken.userId;
  const studentClass = decodedToken.classNumber;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAccessedCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/student/course_access/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAccessedCourses(response.data);
      } catch (error) {
        console.log("Error fetching accessed courses:", error);
      }
    };
    const fetchAllCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/student/all-courses/${studentClass}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAllCourses(response.data);
      } catch (error) {
        console.log("Error fetching all courses:", error);
      }
    };

    fetchAccessedCourses();
    fetchAllCourses();
  }, [userId]);

  const hasAccessedCourses = accessedCourses.length > 0;

  const showPdf = async (id, firstname, lastname) => {
    try {
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 3);
      const currentTimeISO = currentTime
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const accessedCourse = accessedCourses.find(
        (course) => course.course_id === id
      );
      if (accessedCourse) {
        const response = await axios.put(
          `http://localhost:3001/student/course_access/${accessedCourse.id}`,
          {
            access_time: currentTimeISO,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          // Update successful
          navigate(`/elev/curs/${id}`, {
            state: { firstName: firstname, lastName: lastname },
          });
        }
      } else {
        const response = await axios.post(
          "http://localhost:3001/student/course_access",
          {
            user_id: userId,
            course_id: id,
            access_time: currentTimeISO,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          // Insertion successful
          navigate(`/elev/curs/${id}`, {
            state: { firstName: firstname, lastName: lastname },
          });
        }
      }
    } catch (error) {
      console.log("Error updating/inserting course access data:", error);
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
      <div className="student--profil--page--content">
        {hasAccessedCourses ? (
          <div>
            <h5
              style={{
                textAlign: "center",
                marginTop: "20px",
                marginBottom: "40px",
              }}
            >
              Bine ai revenit, {decodedToken.firstName}! Reia cursurile!
            </h5>

            {accessedCourses.map((course) => (
              <Card
                title={course.title}
                key={`accessed_${course.id}`}
                description={course.description}
                classes={course.classes}
                id={course.id}
                showPdf={showPdf}
                last_access={course.access_time}
                firstname={course.firstName}
                lastname={course.lastName}
              />
            ))}
          </div>
        ) : (
          <div>
            <h5
              style={{
                textAlign: "center",
                marginTop: "20px",
                marginBottom: "40px",
              }}
            >
              Bine ai venit, {decodedToken.firstName}! Descoperă Puterea
              Matematicii: Învață, Explorează, Reușește!
            </h5>
            <p>Ți-am pregătit o selecție de cursuri special pentru tine!</p>

            {allCourses.map((course) => (
              <Card
                title={course.title}
                key={`all_${course.id}`}
                description={course.description}
                classes={course.classes}
                id={course.id}
                showPdf={showPdf}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
