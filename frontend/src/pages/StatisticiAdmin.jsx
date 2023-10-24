import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserChart from "../components/UserChart";
import axios from "axios";
import Navbar from "../components/Navbar";

const StatisticiAdmin = ({ onLogout, token, decodedToken }) => {
  const [studentCount, setStudentCount] = useState();
  const [teacherCount, setTeacherCount] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:3001/studentsCount", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStudentCount(res.data[0].students);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:3001/teachersCount", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTeacherCount(res.data[0].teachers);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="div--all">
      <Navbar
        pages={["utilizatori", "statistici", "cereri"]}
        onLogout={onLogout}
        role="admin"
        user={decodedToken}
        token={token}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <h4>Statistica utilizatorilor în funcție de rol</h4>
        <div style={{ width: "500px", height: "500px", marginTop: "30px" }}>
          <UserChart studentCount={studentCount} teacherCount={teacherCount} />
        </div>
      </div>
    </div>
  );
};

export default StatisticiAdmin;
