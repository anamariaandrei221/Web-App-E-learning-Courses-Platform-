import React, { useState } from "react";
import Navbar from "../components/Navbar";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import Axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";
import jwt_decode from "jwt-decode";
export default function TeacherCourses({ onLogout, token, decodedToken }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const classes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const space = "l";
  const navigate = useNavigate();
  const userId = decodedToken.userId;
  console.log(userId);
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("course_path", data.course_path[0]);
    formData.append("classes", data.classes);
    formData.append("user_id", userId);

    try {
      const response = await Axios.post(
        "http://localhost:3001/profesor/add-courses",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle successful response, e.g., show success message or navigate to a different page
      console.log("Course uploaded successfully", response.data);
      navigate("/profesor/cursuri");
    } catch (error) {
      // Handle error, e.g., display error message
      console.error("Error uploading course", error);
      // setErrorMessage("Error uploading course. Please try again.");
    }
  };

  return (
    <div className="div--all">
      <Navbar
        pages={["cursuri", "teste", "statistici", "alte cursuri"]}
        onLogout={onLogout}
        role="profesor"
        user={decodedToken}
        token={token}
      />
      <div className="div--center">
        <div className="add--courses">
          <h4>Adăugare curs</h4>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="form--add--courses"
          >
            <TextField
              size="small"
              label="Titlu"
              variant="outlined"
              fullWidth
              name="title"
              {...register("title", {
                required: "Titlul este obligatoriu!",
              })}
              error={!!errors?.title}
              helperText={errors?.title ? errors.title.message : " "}
            />

            <TextField
              label="Descriere"
              variant="outlined"
              multiline
              fullWidth
              rows={2}
              name="description"
              {...register("description", {
                required: "Descrierea este obligatorie!",
              })}
              error={!!errors?.description}
              helperText={
                errors?.description ? errors.description.message : " "
              }
            />
            <TextField
              size="small"
              select
              fullWidth
              label="Clasa"
              defaultValue=""
              name="classes"
              {...register("classes", { required: "Alegeti clasa!" })}
              error={!!errors?.classes}
              helperText={errors?.classes ? errors.classes.message : " "}
            >
              {classes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <input
              name="course_path"
              type="file"
              accept=".pdf"
              {...register("course_path", {
                required: "Încărcați un fișier PDF!",
              })}
            />
            {errors.course_path ? (
              <p
                style={{
                  color: "red",
                  fontSize: "13px",
                  marginLeft: "10px",
                  paddingBottom: "5px",
                }}
              >
                {errors.course_path.message}
              </p>
            ) : (
              <p style={{ color: "white" }}>{space}</p>
            )}
            <div className="div--button--add--courses">
              <Button
                variant="contained"
                size="large"
                type="submit"
                style={{ width: "150px" }}
              >
                Adaugă
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
