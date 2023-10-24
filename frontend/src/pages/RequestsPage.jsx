import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import TableRequests from "../components/TableRequests";
export default function RequestsPage({ onLogout, token, decodedToken }) {
  const [usersRequests, setUsersRequests] = useState([]);

  useEffect(() => {
    fetchUsersRequests();
  }, []);

  const fetchUsersRequests = () => {
    axios
      .get("http://localhost:3001/admin/usersreq", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsersRequests(response.data);
      });
  };
  return (
    <div className="div--all">
      <Navbar
        pages={["utilizatori", "statistici", "cereri"]}
        onLogout={onLogout}
        role="admin"
        user={decodedToken}
        token={token}
      />
      <div className="user--cards">
        <TableRequests
          usersRequests={usersRequests}
          refresh={fetchUsersRequests}
          token={token}
        ></TableRequests>
      </div>
    </div>
  );
}
