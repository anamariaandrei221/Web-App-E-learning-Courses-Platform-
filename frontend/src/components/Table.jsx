import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import Modal from "../components/Modal";
const StyledTableContainer = styled(TableContainer)`
  max-height: 550px;
  overflow: auto;
`;
const InputStyled = styled("input")`
  border: none;
  outline: none;
  border-bottom: 1px solid black;
`;
export default function BasicTable({
  users,
  onClickDelete,
  onChange,
  onCancel,
  token,
}) {
  const [editMode, setEditMode] = useState({});

  const [message, setMessage] = useState("");

  const handleEditClick = (userId) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [userId]: true,
    }));
  };

  const handleCancelClick = (userId) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [userId]: false,
    }));
    onCancel();
  };

  const handleDeleteClick = (userId) => {
    onClickDelete(userId);
    setMessage("Utilizator sters cu succes!");
  };

  const handleSaveClick = (userId) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [userId]: false,
    }));
    const updatedUser = users.find((user) => user.id === userId);
    axios
      .put(`http://localhost:3001/admin/users/${userId}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("User updated successfully");
        setMessage("Utilizator actualizat cu succes!");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };
  const handleChange = (userId, field, value) => {
    onChange(userId, field, value);
  };

  const isEditMode = (userId) => editMode[userId] || false;
  const closeModal = () => {
    setMessage("");
  };
  return (
    <StyledTableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead
          style={{
            position: "sticky",
            top: "0",
            zIndex: "1",
            backgroundColor: "rgb(232,232,232)",
          }}
        >
          <TableRow>
            <TableCell style={{ fontWeight: "bold", width: "220px" }}>
              Nume
            </TableCell>
            <TableCell style={{ fontWeight: "bold", width: "220px" }}>
              Prenume
            </TableCell>
            <TableCell style={{ fontWeight: "bold", width: "220px" }}>
              Email
            </TableCell>
            <TableCell style={{ fontWeight: "bold", width: "220px" }}>
              Rol
            </TableCell>
            <TableCell style={{ fontWeight: "bold", width: "220px" }}>
              Parola
            </TableCell>
            <TableCell style={{ fontWeight: "bold", width: "100px" }}>
              Acțiuni
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell component="th" scope="row">
                {isEditMode(user.id) ? (
                  <InputStyled
                    type="text"
                    value={user.lastname}
                    onChange={(e) =>
                      handleChange(user.id, "lastname", e.target.value)
                    }
                  />
                ) : (
                  user.lastname
                )}
              </TableCell>
              <TableCell>
                {isEditMode(user.id) ? (
                  <InputStyled
                    type="text"
                    value={user.firstname}
                    onChange={(e) =>
                      handleChange(user.id, "firstname", e.target.value)
                    }
                  />
                ) : (
                  user.firstname
                )}
              </TableCell>
              <TableCell>
                {isEditMode(user.id) ? (
                  <InputStyled
                    type="text"
                    value={user.email}
                    onChange={(e) =>
                      handleChange(user.id, "email", e.target.value)
                    }
                  />
                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell>
                {isEditMode(user.id) ? (
                  <InputStyled
                    type="text"
                    value={user.role}
                    onChange={(e) =>
                      handleChange(user.id, "role", e.target.value)
                    }
                  />
                ) : (
                  user.role
                )}
              </TableCell>
              <TableCell>
                {isEditMode(user.id) ? (
                  <InputStyled
                    type="text"
                    value={user.password}
                    onChange={(e) =>
                      handleChange(user.id, "password", e.target.value)
                    }
                  />
                ) : (
                  user.password
                )}
              </TableCell>
              <TableCell>
                {isEditMode(user.id) ? (
                  <>
                    <IconButton onClick={() => handleSaveClick(user.id)}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton onClick={() => handleCancelClick(user.id)}>
                      <ClearIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton onClick={() => handleEditClick(user.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {message && <Modal message={message} onClose={closeModal}></Modal>}
    </StyledTableContainer>
  );
}
