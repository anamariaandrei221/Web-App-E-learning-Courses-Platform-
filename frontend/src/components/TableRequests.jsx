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
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

// Import the styles
const StyledTableContainer = styled(TableContainer)`
  max-height: 550px;
  overflow: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

export default function BasicTable({ usersRequests, refresh, token }) {
  const handleAccept = (userId) => {
    axios
      .put(
        `http://localhost:3001/admin/users/${userId}`,
        {
          state: null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // Actualizare reușită, puteți efectua orice acțiune necesară
        refresh();
        console.log("Starea utilizatorului a fost actualizată cu succes");
      })
      .catch((error) => {
        // Tratați eventualele erori
        console.error("Eroare la actualizarea stării utilizatorului", error);
      });
  };

  const handleReject = (userId) => {
    // Remove the user from the database
    axios
      .delete(`http://localhost:3001/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Deletion successful, perform any necessary actions
        refresh();
        console.log("User has been deleted successfully");
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error deleting user", error);
      });
  };
  const handleOpenPdf = (pdfPath) => {
    const baseUrl = "http://localhost:3001/"; // Replace with your actual base URL or file server path
    //const url = baseUrl + pdfPath;
    const url = baseUrl + pdfPath.replace(/\\/g, "/");
    // Open the URL of the PDF in a new tab or window
    console.log(url);
    window.open(url);
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
            {/* <TableCell style={{ fontWeight: "bold", width: "220px" }}>
              Parola
            </TableCell> */}
            <TableCell style={{ fontWeight: "bold", width: "100px" }}>
              Document
            </TableCell>
            <TableCell
              style={{
                fontWeight: "bold",
                width: "100px",
                textAlign: "center",
              }}
            >
              Acțiuni
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersRequests.map((user) => (
            <TableRow key={user.id}>
              <TableCell component="th" scope="row">
                {user.lastname}
              </TableCell>
              <TableCell>{user.firstname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>

              <TableCell>
                <IconButton onClick={() => handleOpenPdf(user.diploma_path)}>
                  <PictureAsPdfIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CheckIcon />}
                    color="success"
                    onClick={() => handleAccept(user.id)}
                  >
                    Acceptă
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    startIcon={<ClearIcon />}
                    onClick={() => handleReject(user.id)}
                  >
                    Respinge
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}
