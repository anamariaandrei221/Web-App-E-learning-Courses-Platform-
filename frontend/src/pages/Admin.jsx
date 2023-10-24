import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Table from "../components/Table";

export default function Admin({ onLogout, token, decodedToken }) {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
        setOriginalUsers(response.data);
      });
  }, []);

  const handleDelete = (userId) => {
    axios
      .delete(`http://localhost:3001/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(users.filter((user) => user.id !== userId));
      });
  };

  const handleChange = (userId, field, value) => {
    // Update the user data in the component's state

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, [field]: value } : user
      )
    );
  };

  const handleCancel = () => {
    setUsers(originalUsers);
  };

  const handleLogout = () => {
    // Apelați funcția de deconectare (onLogout) pentru a implementa logica specifică de deconectare
    onLogout();
    // Resetați starea utilizatorilor la un array gol
    setUsers([]);
  };

  return (
    <div className="div--all">
      <Navbar
        pages={["utilizatori", "statistici", "cereri"]}
        onLogout={handleLogout}
        role="admin"
        user={decodedToken}
        token={token}
      />
      <div className="user--cards">
        <Table
          token={token}
          users={users}
          onClickDelete={handleDelete}
          onChange={handleChange}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
