import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../../components/Card";

export default function AllCourses({ onLogout, token, decodedToken }) {
  const [courses, setCourses] = useState([]);
  const [accessedCourses, setAccessedCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const navigate = useNavigate();
  const userId = decodedToken.userId;

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
          `http://localhost:3001/student/all-courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (error) {
        console.log("Error fetching all courses:", error);
      }
    };

    fetchAccessedCourses();
    fetchAllCourses();
  }, [userId]);

  const handleSearch = (searchValue, selectedClass, isChecked) => {
    let filtered = courses;

    if (searchValue) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().startsWith(searchValue.toLowerCase())
      );
    }

    if (selectedClass) {
      filtered = filtered.filter(
        (course) => Number(course.classes) === Number(selectedClass)
      );
    }
    if (isChecked) {
      filtered = filtered.filter((course) => course.hasQuestions === 1);
    }

    setFilteredCourses(filtered);
  };

  const showPdf = async (id, firstname, lastname) => {
    try {
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 3);
      const currentTimeISO = currentTime
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const accessedCourse = accessedCourses.find((course) => course.id === id);

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
          console.log("a mers");
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
      <div className="courses">
        <Sidebar handleSearch={handleSearch} />
        <div className="all--courses--card">
          <div className="scrollable-content">
            {filteredCourses.map((course) => (
              <Card
                title={course.title}
                key={course.id}
                description={course.description}
                classes={course.classes}
                id={course.id}
                showPdf={showPdf}
                page={courses}
                firstname={course.firstname}
                lastname={course.lastname}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
