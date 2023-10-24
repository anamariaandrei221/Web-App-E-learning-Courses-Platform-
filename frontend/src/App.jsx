import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Student from "./pages/Student/Student";
import ViewCourse from "./pages/Student/ViewCourse";
import AllCourses from "./pages/Student/AllCourses";
import StudentTestPage from "./pages/Student/TestPage";
import Register from "./pages/Register";
import { Navigate } from "react-router-dom";
import CoursesPdf from "./pages/CoursesPdf";
import StatisticiAdmin from "./pages/StatisticiAdmin";
import RequestsPage from "./pages/RequestsPage";
import TeacherCourses from "./pages/TeacherCourses";
import TeacherAddCourses from "./pages/TeacherAddCourses";
import jwt_decode from "jwt-decode";
import AddTestPage from "./pages/AddTestPage";
import TestPage from "./pages/TestPage";
import ViewTestPage from "./pages/ViewTestPage";
import AllCoursesPage from "./pages/AllCoursesPage";
import ViewCourseEveryone from "./pages/ViewCourseEveryone";
import StatisticiTeste from "./pages/StatisticiTeste";
import { useState, useEffect } from "react";

function App() {
  const [isAuth, setIsAuth] = useState({});
  const token = localStorage.getItem("token");
  let decodedToken = null;

  if (token) {
    decodedToken = jwt_decode(token);
  }
  const handleLogout = () => {
    decodedToken = null;
    localStorage.clear("token");
  };
  // useEffect(() => {
  //   console.log(isAuth);
  // }, [isAuth]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/elev/istoric"
          element={
            isAuth ? (
              <Student
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/elev/curs/:courseId"
          element={
            isAuth ? (
              <ViewCourse
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/elev/cursuri"
          element={
            isAuth ? (
              <AllCourses
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/elev/course/:courseId/start-test/:testId"
          element={
            isAuth ? (
              <StudentTestPage
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/profesor/cursuri"
          element={
            isAuth ? (
              <TeacherCourses
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/profesor/altecursuri"
          element={
            isAuth ? (
              <AllCoursesPage
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/profesor/teste"
          element={
            isAuth ? (
              <TestPage
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/profesor/teste/view-test/:testId"
          element={
            isAuth ? (
              <ViewTestPage
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/profesor/cursuri/view-course/:courseId"
          element={
            isAuth ? (
              <CoursesPdf
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/profesor/cursuri/:courseId"
          element={
            isAuth ? (
              <ViewCourseEveryone
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/profesor/adaugare-cursuri"
          element={
            isAuth ? (
              <TeacherAddCourses
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/profesor/adaugare-test/:courseId"
          element={
            isAuth ? (
              <AddTestPage
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/profesor/statistici"
          element={
            isAuth ? (
              <StatisticiTeste
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/utilizatori"
          element={
            isAuth ? (
              <Admin
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin/statistici"
          element={
            isAuth ? (
              <StatisticiAdmin
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin/cereri"
          element={
            isAuth ? (
              <RequestsPage
                onLogout={handleLogout}
                token={token}
                decodedToken={decodedToken}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}
export default App;
