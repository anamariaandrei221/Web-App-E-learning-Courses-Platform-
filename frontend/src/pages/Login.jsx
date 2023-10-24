import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "../components/Modal";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Navbar from "../components/Navbar";
const Login = (props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const handleCloseError = () => {
    setErrorMessage("");
  };
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleLogin = async (data, event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.message) {
        setErrorMessage(response.data.message);
      } else {
        const token = response.data.token;
        if (token) props.setIsAuth(token);
        localStorage.setItem("token", token);

        switch (response.data.results[0].role) {
          case "Elev":
            navigate("/elev/istoric");
            break;
          case "Profesor":
            console.log("asdf");
            navigate("/profesor/cursuri");
            break;
          case "admin":
            navigate("/admin/utilizatori");
            break;
          default:
            navigate("/");
        }
        console.log("here2");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="div--all">
      <Navbar pages={[]} />
      <div className="container--register--login--page">
        <div className="container--login">
          <div className="title">
            <h3>Autentificare</h3>
          </div>
          <form noValidate onSubmit={handleSubmit(handleLogin)}>
            <TextField
              size="small"
              label="Email"
              name="email"
              required
              fullWidth
              {...register("email", { required: "Introduceti emailul" })}
              error={!!errors?.email}
              helperText={errors?.email ? errors.email.message : " "}
            />
            <TextField
              required
              fullWidth
              size="small"
              label="Parola"
              name="password"
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Introduceti parola" })}
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

            <div className="button--register--login--div">
              <Button
                variant="contained"
                type="submit"
                className="button--register--login"
              >
                Autentifică-te
              </Button>
            </div>
          </form>
          <div className="div--register--now">
            <p>
              Nu ai cont? <a href="/register">Înscrie-te</a>
            </p>
          </div>
        </div>
        {errorMessage && (
          <Modal message={errorMessage} onClose={handleCloseError} />
        )}
      </div>
    </div>
  );
};

export default Login;
