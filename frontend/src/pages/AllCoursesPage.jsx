import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function AllCoursesPage({ onLogout, token, decodedToken }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  const userId = decodedToken.userId;
  useEffect(() => {
    fetchUsersRequests();
  }, [userId]);

  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  const fetchUsersRequests = () => {
    axios
      .get(`http://localhost:3001/profesor/courses/all/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCourses(response.data);
      });
  };

  const showPdf = (id, firstname, lastname) => {
    navigate(`/profesor/cursuri/${id}`, {
      state: { firstName: firstname, lastName: lastname },
    });
  };

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

  const handleLogout = () => {
    // Restul codului pentru deconectare
    onLogout();
    // Resetați starea cursurilor și a cursurilor filtrate la un array gol
    setCourses([]);
    setFilteredCourses([]);
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
