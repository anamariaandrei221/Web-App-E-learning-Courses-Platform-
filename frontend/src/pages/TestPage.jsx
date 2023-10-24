import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import CardTestPreview from "../components/CardTestPreview";
import { useNavigate } from "react-router-dom";

export default function TestPage({ onLogout, token, decodedToken }) {
  const userId = decodedToken.userId;
  const [tests, setTests] = useState([]);
  const [filteredtests, setFilteredTests] = useState([]);
  const navigate = useNavigate();
  const handleLogout = () => {
    onLogout();
  };

  useEffect(() => {
    fetchUsersRequests();
  }, [userId]);

  useEffect(() => {
    setFilteredTests(tests);
  }, [tests]);
  const fetchUsersRequests = () => {
    axios
      .get(`http://localhost:3001/profesor/teste/getbyuserid/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTests(response.data);
      });
  };

  const handleSearch = (searchValue, selectedClass, selectedDifficulty) => {
    let filtered = tests;

    if (searchValue) {
      filtered = filtered.filter((test) =>
        test.course_title.toLowerCase().startsWith(searchValue.toLowerCase())
      );
    }

    if (selectedClass) {
      filtered = filtered.filter(
        (test) => Number(test.classes) === Number(selectedClass)
      );
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(
        (test) => test.difficulty === selectedDifficulty
      );
    }

    setFilteredTests(filtered);
  };

  const showTest = (testId) => {
    navigate(`/profesor/teste/view-test/${testId}`);
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
        <Sidebar handleSearch={handleSearch} page="tests"></Sidebar>
        <div className="all--courses--card">
          <div className="scrollable-content">
            {filteredtests.map((test) => (
              <CardTestPreview
                title={test.course_title}
                key={test.test_id}
                classes={test.classes}
                questionsNumber={test.question_count}
                difficulty={test.difficulty}
                id={test.test_id}
                showTest={showTest}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
