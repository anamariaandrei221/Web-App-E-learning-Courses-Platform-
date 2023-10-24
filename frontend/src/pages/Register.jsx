import { useForm } from "react-hook-form";
import Axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "../components/Modal";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Navbar from "../components/Navbar";
const FIRSTNAME_REGEX = /^[a-zA-Z' ]{2,30}$/;
const LASTNAME_REGEX = /^[a-zA-Z' ]{2,30}$/;
const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{5,24}$/;

export default function Register() {
  const roles = ["Elev", "Profesor"];
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const registering = async (data) => {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("role", data.role);
      formData.append("password", data.password);
      if (selectedRole === "Elev") {
        formData.append("studentClass", data.studentClass);
      }
      if (selectedRole === "Profesor") {
        formData.append("diploma", data.diploma[0]);
      }

      const response = await Axios.post(
        "http://localhost:3001/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        if (data.role === "Elev")
          setErrorMessage("Contul a fost creat cu succes!");
        else
          setErrorMessage(
            "Contul tău va fi revizuit de către un administrator și va fi creat în următoarele 24 de ore!"
          );
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  const handleStudentClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };
  const handleCloseError = () => {
    setErrorMessage("");
    navigate("/");
  };
  return (
    <div className="div--all">
      <Navbar pages={[]}></Navbar>
      <div className="container--register--login--page">
        <div className="container--register">
          <div className="title">
            <h5>Înscrie-te și începe să înveți!</h5>
          </div>

          <form noValidate onSubmit={handleSubmit(registering)}>
            <TextField
              size="small"
              select
              label="Rol"
              defaultValue=""
              name="role"
              {...register("role", { required: "Alegeti rolul" })}
              error={!!errors?.role}
              helperText={errors?.role ? errors.role.message : " "}
              onChange={handleRoleChange}
            >
              {roles.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            {selectedRole === "Elev" && (
              <TextField
                size="small"
                select
                label="Clasa"
                defaultValue=""
                name="studentClass"
                {...register("studentClass", { required: "Alegeti clasa" })}
                error={!!errors?.studentClass}
                helperText={
                  errors?.studentClass ? errors.studentClass.message : " "
                }
                onChange={handleStudentClassChange}
              >
                {Array.from({ length: 12 }, (_, index) => index + 1).map(
                  (classNumber) => (
                    <MenuItem key={classNumber} value={classNumber}>
                      {classNumber}
                    </MenuItem>
                  )
                )}
              </TextField>
            )}
            <TextField
              size="small"
              name="lastName"
              className="input--register"
              label="Nume"
              variant="outlined"
              fullWidth
              required
              {...register("lastName", {
                required: "Introduceti numele",
                pattern: {
                  value: LASTNAME_REGEX,
                  message: "Doare litere",
                },
              })}
              error={!!errors?.lastName}
              helperText={errors?.lastName ? errors.lastName.message : " "}
            />
            <TextField
              size="small"
              name="firstName"
              className="input--register"
              label="Prenume"
              variant="outlined"
              fullWidth
              required
              {...register("firstName", {
                required: "Introduceti prenumele",
                pattern: {
                  value: FIRSTNAME_REGEX,
                  message: "Doare litere",
                },
              })}
              error={!!errors?.firstName}
              helperText={errors?.firstName ? errors.firstName.message : " "}
            />

            <TextField
              size="small"
              name="email"
              className="input--register"
              label="Email"
              variant="outlined"
              fullWidth
              required
              {...register("email", {
                required: "Introduceti emailul",
                pattern: {
                  value: EMAIL_REGEX,
                  message: "Email invalid",
                },
              })}
              error={!!errors?.email}
              helperText={errors?.email ? errors.email.message : " "}
            />
            <TextField
              size="small"
              name="password"
              className="input--register"
              label="Parola"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              {...register("password", {
                required: "Introduceti parola",
                pattern: {
                  value: PASSWORD_REGEX,
                  message:
                    "Minim 5 caractere, o literă mică, o literă mare și un caracter special (!@#$%)",
                },
              })}
              error={!!errors?.password}
              helperText={errors?.password ? errors.password.message : " "}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowPassword((prevShowPassword) => !prevShowPassword)
                      }
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {selectedRole === "Profesor" && (
              <div style={{ marginBottom: "15px" }}>
                <p style={{ margin: 0 }}>Atașare diplomă </p>
                <input
                  type="file"
                  accept=".pdf"
                  className="input--register"
                  {...register("diploma", { required: "Încărcați diploma" })}
                />
                {errors.diploma && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "13px",
                      marginLeft: "12px",
                      marginTop: "3px",
                    }}
                  >
                    {errors.diploma.message}
                  </p>
                )}
              </div>
            )}
            <div className="button--register--login--div">
              <Button
                variant="contained"
                type="submit"
                className="button--register--login"
              >
                Înscrie-te
              </Button>
            </div>
          </form>
        </div>
        {errorMessage && (
          <Modal message={errorMessage} onClose={handleCloseError} />
        )}
      </div>
    </div>
  );
}
