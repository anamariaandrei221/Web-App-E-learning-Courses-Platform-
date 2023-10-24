import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import Modal from "../components/Modal";
import TextField from "@mui/material/TextField";
import QuizIcon from "@mui/icons-material/Quiz";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
export default function CoursesPdf({
  onLogout,
  token,
  decodedToken = { decodedToken },
}) {
  const [pdfPath, setPdfPath] = useState("");
  const [course, setCourse] = useState({});
  const [editedCourse, setEditedCourse] = useState({});
  const { courseId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const classes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const responseCourse = await axios.get(
          `http://localhost:3001/profesor/courses/details/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const pdfPath = responseCourse.data[0].course_path;
        const baseUrl = "http://localhost:3001/";
        const url = baseUrl + pdfPath.replace(/\\/g, "/");
        setPdfPath(url);
        setCourse(responseCourse.data[0]);
      } catch (error) {
        console.log("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, []);
  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("title", editedCourse.title);
    formData.append("description", editedCourse.description);
    formData.append("classes", editedCourse.classes);
    formData.append("course_path", editedCourse.course_path);

    axios
      .put(
        `http://localhost:3001/profesor/courses/updatecourse/${courseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setMessage("Curs actualizat cu succes!");
        setCourse(editedCourse); // Update the course state with the editedCourse
        setEditMode(false); // Exit edit mode
      })
      .catch((error) => {
        console.log("Error updating course:", error);
      });
  };

  const handleEditMode = () => {
    setEditMode(true);
    setEditedCourse({ ...course });
  };

  const closeModal = () => {
    setMessage("");
    navigate("/profesor/cursuri");
  };
  const handleDelete = (courseId) => {
    axios
      .delete(
        `http://localhost:3001/profesor/courses/deletecourse/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setMessage("Curs șters cu succes!");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setEditedCourse((prevCourse) => ({
      ...prevCourse,
      course_path: file,
    }));
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
      <div className="div--view--course">
        <div className="course--details">
          <div
            className={`course--details--buttons ${
              editMode ? "redBackground" : ""
            }`}
          >
            {editMode ? (
              <div>
                <IconButton onClick={handleUpdate}>
                  <CheckIcon style={{ color: "white" }}></CheckIcon>
                </IconButton>
                <IconButton onClick={() => setEditMode(false)}>
                  <ClearIcon style={{ color: "white" }}></ClearIcon>
                </IconButton>
              </div>
            ) : (
              <div>
                <Button
                  style={{ color: "white" }}
                  startIcon={<QuizIcon />}
                  onClick={() => {
                    navigate(`/profesor/adaugare-test/${courseId}`);
                  }}
                >
                  Adaugă test
                </Button>
                <IconButton onClick={() => handleDelete(courseId)}>
                  <DeleteIcon style={{ color: "white" }}></DeleteIcon>
                </IconButton>
                <IconButton onClick={handleEditMode}>
                  <EditIcon style={{ color: "white" }}></EditIcon>
                </IconButton>
              </div>
            )}
          </div>

          <div className="div--course--details--content">
            {editMode ? (
              <div className="course--details--inputs">
                <div className="input-row">
                  <div className={`input-label `}>Titlu</div>
                  <TextField
                    fullWidth
                    size="small"
                    type="text"
                    value={editedCourse.title}
                    name="title"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-row">
                  <div className={`input-label `}>Descriere</div>
                  <TextField
                    fullWidth
                    size="small"
                    name="description"
                    value={editedCourse.description}
                    multiline
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>
                <div className="input-row">
                  <div className={`input-label `}>Clasa</div>
                  <TextField
                    size="small"
                    fullWidth
                    select
                    type="text"
                    value={editedCourse.classes}
                    name="classes"
                    onChange={handleInputChange}
                  >
                    {" "}
                    {classes.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <input
                  name="course_path"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInputChange}
                />
              </div>
            ) : (
              <div className="course--details--inputs">
                <p>
                  <span>Titlu - </span> {course.title}
                </p>
                <p>
                  <span>Descriere - </span> {course.description}
                </p>
                <p>
                  <span>Clasa - </span> {course.classes}
                </p>
                <p>
                  <span>Număr teste adăugate - </span> {course.test_count}
                </p>
              </div>
            )}

            {pdfPath && (
              <object
                width="100%"
                height="500"
                data={pdfPath}
                type="application/pdf"
              >
                <p>Unable to display PDF</p>
              </object>
            )}
          </div>
        </div>
      </div>
      {message && <Modal message={message} onClose={closeModal}></Modal>}
    </div>
  );
}
