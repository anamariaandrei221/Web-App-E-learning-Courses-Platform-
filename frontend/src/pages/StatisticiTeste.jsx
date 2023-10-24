import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import BarChart from "../components/BarChart";
import axios from "axios";
import TestsChart from "../components/TestsChart";

export default function StatisticiTeste({ onLogout, token, decodedToken }) {
  const [courseData, setCourseData] = useState([]);
  const [testData, setTestData] = useState([]);

  const handleLogout = () => {
    onLogout();
    setCourseData([]);
  };

  useEffect(() => {
    fetchCourseData();
    fetchTestData();
  }, []);

  const fetchCourseData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/profesor/course/statistici/${decodedToken.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCourseData(response.data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };
  const fetchTestData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/profesor/course/statistici-teste/${decodedToken.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTestData(response.data);
    } catch (error) {
      console.error("Error fetching test data:", error);
    }
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          padding: "30px",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="barchart">
            <BarChart courseData={courseData}></BarChart>
          </div>
        </div>
        <div className="statistici--teste">
          {testData.map((test) => (
            <div className="test-statistici--container" key={test.test_id}>
              <p>Statistica notelor pentru cursul - {test.course_title}</p>
              <TestsChart testData={test}></TestsChart>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
