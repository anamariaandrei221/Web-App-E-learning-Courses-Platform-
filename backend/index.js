import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import jwt from "jsonwebtoken";
import fs from "fs";
const app = express();

app.use(express.json());
app.use(cors());
const secretKey = "cheiaSecreta";

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "oracle",
  database: "elearning",
});
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, secretKey);
      req.userId = decoded.userId;
      req.firstName = decoded.firstName;
      req.lastName = decoded.lastName;
      req.userEmail = decoded.userEmail;
      req.role = decoded.role;
      req.classNumber = decoded.classNumber;
      next();
    } catch (error) {
      res.status(401).json({ error: "Token invalid" });
    }
  } else {
    res.status(401).json({ error: "Token missing" });
  }
};

///STUDENT REQUESTS

app.get("/student/course_access/:userId", verifyToken, (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT course_access.*, courses.*, user.firstName, user.lastName FROM course_access INNER JOIN courses ON course_access.course_id = courses.id INNER JOIN user ON courses.user_id = user.id WHERE course_access.user_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.status(200).send(results);
      }
    }
  );
});

app.get("/student/all-courses/:studentClass", verifyToken, (req, res) => {
  const studentClass = req.params.studentClass;
  db.query(
    "SELECT courses.*, user.firstname, user.lastname FROM courses INNER JOIN user ON courses.user_id = user.id WHERE courses.classes = ?",
    [studentClass],
    (error, results) => {
      if (error) {
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.status(200).send(results);
      }
    }
  );
});

app.get("/student/all-courses", verifyToken, (req, res) => {
  db.query(
    `SELECT distinct
    courses.*,
    user.firstname,
    user.lastname,
    CASE WHEN questions.course_id IS NOT NULL THEN 1 ELSE 0 END AS hasQuestions
  FROM
    courses
    INNER JOIN user ON courses.user_id = user.id
    LEFT JOIN questions ON courses.id = questions.course_id
  ORDER BY CAST(courses.classes AS SIGNED) DESC;`,

    (error, results) => {
      if (error) {
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.status(200).send(results);
      }
    }
  );
});
app.get("/profesor/course/statistici/:userId", verifyToken, (req, res) => {
  const userId = req.params.userId;
  db.query(
    `SELECT c.id,  c.title, COUNT(ca.course_id) AS access_count
    FROM courses c
    JOIN course_access ca ON c.id = ca.course_id
    WHERE c.user_id = ?
    GROUP BY c.id;`,
    [userId],

    (error, results) => {
      if (error) {
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.status(200).send(results);
      }
    }
  );
});

app.get(
  "/profesor/course/statistici-teste/:userId",
  verifyToken,
  (req, res) => {
    const userId = req.params.userId;
    db.query(
      `SELECT
      c.id AS course_id,
      c.title AS course_title,
      ut.test_id,
      GROUP_CONCAT(ut.grade) AS test_grades
    FROM
      courses c
    JOIN
      user_tests ut ON c.id = ut.course_id
    WHERE
      c.user_id = 42
    GROUP BY
      c.id, c.title, ut.test_id;
    `,
      [userId],

      (error, results) => {
        if (error) {
          res.status(500).send({ error: "Internal Server Error" });
        } else {
          res.status(200).send(results);
        }
      }
    );
  }
);

app.post("/student/course_access", verifyToken, (req, res) => {
  const { user_id, course_id, access_time } = req.body;
  console.log(user_id, course_id, access_time);
  db.query(
    "INSERT INTO course_access (user_id, course_id, access_time) VALUES (?, ?, ?)",
    [user_id, course_id, access_time],
    (error, results) => {
      if (error) {
        console.error("Error inserting course access data:", error);
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.sendStatus(200);
      }
    }
  );
});
app.post("/student/user_answer", async (req, res) => {
  try {
    // Extract the necessary data from the request body
    const { userId, courseId, questionId, testId, selectedAnswer } = req.body;
    console.log(testId);
    // Insert the user answer into the database
    const query =
      "INSERT INTO user_answers (user_id, course_id, question_id, test_id, selected_answer) VALUES (?, ?, ?, ?, ?)";
    db.query(
      query,
      [userId, courseId, questionId, testId, selectedAnswer],
      (err, results) => {
        if (err) {
          console.error("Error inserting user answer into the database:", err);
          res.status(500).json({
            error: "An error occurred while inserting the user answer",
          });
        } else {
          // Send a success response
          res
            .status(200)
            .json({ message: "User answer inserted into the database" });
        }
      }
    );
  } catch (error) {
    // Handle errors
    console.log("Error inserting user answer into the database:", error);
    res
      .status(500)
      .json({ error: "An error occurred while inserting the user answer" });
  }
});

app.put("/student/course_access/:accessId", verifyToken, (req, res) => {
  const accessId = req.params.accessId;
  const { access_time } = req.body;

  db.query(
    "UPDATE course_access SET access_time = ? WHERE course_id = ?",
    [access_time, accessId],
    (error, results) => {
      if (error) {
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.status(200).send({ message: "Access time updated successfully" });
      }
    }
  );
});

app.post("/student/result", verifyToken, (req, res) => {
  const { courseId, userId, result, testId } = req.body;

  const query =
    "INSERT INTO user_tests (user_id, course_id, grade, test_id) VALUES (?, ?, ?,?)";
  const values = [userId, courseId, result, testId];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error inserting result:", err);
      res
        .status(500)
        .json({ error: "Failed to insert result into the database" });
    } else {
      console.log("Result inserted successfully");
      res.status(200).json({ message: "Result inserted successfully" });
    }
  });
});

app.post("/profesor/courses/add-test", verifyToken, (req, res) => {
  const data = req.body;

  // Check if data is an array
  if (!Array.isArray(data)) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  // Retrieve the last id from the questions table
  const lastIdQuery = "SELECT id FROM questions ORDER BY id DESC LIMIT 1";

  db.query(lastIdQuery, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to retrieve last id" });
    }

    // Get the last id from the query results
    const lastId = results.length > 0 ? results[0].id : 0;

    // Check if lastId is a valid number
    const isValidLastId = Number.isInteger(lastId);

    // Calculate the nextTestId
    const nextTestId = isValidLastId ? lastId + 1 : 1;

    // Execute multiple INSERT statements in a single query to insert the questions
    const insertQuery =
      "INSERT INTO questions (course_id, question, answer1, answer2, answer3, answer4, correct_answer, test_id, difficulty) VALUES ?";

    const values = data.map((question) => [
      question.course_id,
      question.question,
      question.answers[0],
      question.answers[1],
      question.answers[2],
      question.answers[3],
      question.correct_answer,
      nextTestId,
      question.difficulty,
    ]);

    db.query(insertQuery, [values], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to insert questions" });
      } else {
        res.status(200).json({ message: "Questions inserted successfully" });
      }
    });
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "SELECT * FROM user WHERE email = ? AND password = ?",
    [email, password],
    (error, results) => {
      if (error) {
        res.send({ err: error });
      } else if (results.length > 0) {
        if (results[0].state !== null) {
          res.send({
            message:
              "Contul tău este revizuit de către un administrator! Te rugăm să încerci mai târziu!",
          });
        } else {
          const token = jwt.sign(
            {
              userId: results[0].id,
              firstName: results[0].firstname,
              lastName: results[0].lastname,
              role: results[0].role,
              userEmail: results[0].email,
              classNumber: results[0].class,
            },
            secretKey
          );
          res.send({ token, results });
        }
      } else {
        res.send({ message: "Email sau parolă greșite!" });
      }
    }
  );
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".pdf");
  },
});

// Create an upload instance with the storage configuration
const upload = multer({ storage: storage });

app.post("/register", upload.single("diploma"), (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const role = req.body.role;
  const password = req.body.password;
  const studentClass = req.body.studentClass;
  const diplomaPath = req.file ? req.file.path : null; // Verificați dacă există un fișier încărcat

  db.query("SELECT * FROM user WHERE email = ?", [email], (error, results) => {
    if (error) {
      res.status(500).send({ error: "Internal Server Error" });
    } else {
      if (results.length > 0) {
        res
          .status(400)
          .send({ error: "Există deja un cont cu această adresă de email!" });
      } else {
        const state = role === "Profesor" ? "pending" : null; // Verificați rolul pentru a seta atributul state

        db.query(
          "INSERT INTO user (firstname, lastname, email, role, password, diploma_path, state, class) VALUES (?, ?, ?, ?, ?, ?, ?,?)",
          [
            firstName,
            lastName,
            email,
            role,
            password,
            diplomaPath,
            state,
            studentClass,
          ],
          (err, result) => {
            if (err) {
              res.status(500).send({ error: "Internal Server Error" });
            } else {
              res.status(200).send(result);
            }
          }
        );
      }
    }
  });
});

app.post(
  "/profesor/add-courses",
  verifyToken,
  upload.single("course_path"),
  (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const classes = req.body.classes;
    const course_path = req.file ? req.file.path : null;
    const user_id = req.body.user_id;

    db.query(
      "INSERT INTO courses (title,description,course_path,classes,user_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, course_path, classes, user_id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send({ error: "Internal Server Error" });
        } else {
          res.status(200).send(result);
        }
      }
    );
  }
);

app.get("/profesor/courses/getbyuserid/:userId", verifyToken, (req, res) => {
  const userId = req.params.userId;
  db.query(
    `SELECT DISTINCT c.*, CASE WHEN q.course_id IS NOT NULL THEN TRUE ELSE FALSE END AS hasQuestions
    FROM elearning.courses c
    LEFT JOIN elearning.questions q ON c.id = q.course_id
    WHERE c.user_id = ?
    `,
    [userId],
    (error, results) => {
      if (error) {
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.status(200).send(results);
      }
    }
  );
});

app.get("/profesor/courses/all/:userId", verifyToken, (req, res) => {
  const userId = req.params.userId;
  db.query(
    `SELECT distinct courses.*, user.firstname, user.lastname,
    (CASE
      WHEN EXISTS (
        SELECT 1
        FROM questions
        WHERE questions.course_id = courses.id
      )
      THEN 1
      ELSE 0
    END) AS hasQuestions
  FROM courses
  JOIN user ON courses.user_id = user.id
  WHERE courses.user_id != ?
    `,
    [userId],
    (error, results) => {
      if (error) {
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.status(200).send(results);
      }
    }
  );
});
app.get("/profesor/test/getbyid/:testId", verifyToken, (req, res) => {
  const testId = req.params.testId;
  db.query(
    "SELECT q.*, c.title AS courseTitle FROM questions q INNER JOIN courses c ON q.course_id = c.id WHERE q.test_id = ?",
    [testId],
    (error, results) => {
      if (error) {
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.status(200).send(results);
      }
    }
  );
});

app.delete("/profesor/question/delete/:questionId", verifyToken, (req, res) => {
  const questionId = req.params.questionId;
  db.query(
    "DELETE FROM questions WHERE id = ?",
    [questionId],
    (error, results) => {
      if (error) {
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.status(200).send(results);
      }
    }
  );
});

app.delete("/profesor/test/delete/:testId", (req, res) => {
  const { testId } = req.params;

  // Delete user answers
  db.query(
    "DELETE FROM user_answers WHERE test_id = ?",
    [testId],
    (error, results) => {
      if (error) {
        console.error("Error deleting user answers:", error);
        res
          .status(500)
          .json({ error: "An error occurred while deleting user answers" });
      } else {
        // Delete user tests
        db.query(
          "DELETE FROM user_tests WHERE test_id = ?",
          [testId],
          (error, results) => {
            if (error) {
              console.error("Error deleting user tests:", error);
              res
                .status(500)
                .json({ error: "An error occurred while deleting user tests" });
            } else {
              // Delete questions
              db.query(
                "DELETE FROM questions WHERE test_id = ?",
                [testId],
                (error, results) => {
                  if (error) {
                    console.error("Error deleting questions:", error);
                    res.status(500).json({
                      error: "An error occurred while deleting questions",
                    });
                  } else {
                    res.json({
                      message: "Test and associated data deleted successfully",
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.get("/profesor/teste/getbyuserid/:userId", verifyToken, (req, res) => {
  const userId = req.params.userId;
  db.query(
    `SELECT q.test_id, c.title AS course_title, c.classes, q.difficulty, COUNT(q.id) AS question_count
    FROM questions q
    JOIN courses c ON q.course_id = c.id
    WHERE c.user_id = ?
    GROUP BY q.test_id, c.title, c.classes, q.difficulty;
    `,
    [userId],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const transformedResults = results.map((result) => ({
          test_id: result.test_id,
          course_title: result.course_title,
          classes: result.classes,
          difficulty: result.difficulty,
          question_count: result.question_count,
        }));
        res.status(200).json(transformedResults);
      }
    }
  );
});

app.delete(
  "/profesor/courses/deletecourse/:courseId",
  verifyToken,
  (req, res) => {
    const courseId = req.params.courseId;

    // Get the file path of the course
    db.query(
      "SELECT course_path FROM courses WHERE id = ?",
      [courseId],
      (error, results) => {
        if (error) {
          res.status(500).send({ error: "Internal Server Error" });
        } else if (results.length === 0) {
          res.status(404).send({ error: "Course not found" });
        } else {
          const filePath = results[0].course_path;

          // Delete the file from the uploads directory
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
              res.status(500).send({ error: "Internal Server Error" });
            } else {
              // Delete the course from the database
              db.query(
                "DELETE FROM course_access WHERE course_id = ?",
                [courseId],
                (error, results) => {
                  if (error) {
                    res.status(500).send({ error: "Internal Server Error" });
                  } else {
                    db.query(
                      "DELETE FROM user_answers WHERE course_id = ?",
                      [courseId],
                      (error, results) => {
                        if (error) {
                          res
                            .status(500)
                            .send({ error: "Internal Server Error" });
                        } else {
                          db.query(
                            "DELETE FROM questions WHERE course_id = ?",
                            [courseId],
                            (error, results) => {
                              if (error) {
                                res
                                  .status(500)
                                  .send({ error: "Internal Server Error" });
                              } else {
                                db.query(
                                  "DELETE FROM user_tests WHERE course_id = ?",
                                  [courseId],
                                  (error, results) => {
                                    if (error) {
                                      res.status(500).send({
                                        error: "Internal Server Error",
                                      });
                                    } else {
                                      db.query(
                                        "DELETE FROM courses WHERE id = ?",
                                        [courseId],
                                        (error, results) => {
                                          if (error) {
                                            res.status(500).send({
                                              error: "Internal Server Error",
                                            });
                                          } else {
                                            res.status(200).send(results);
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      }
    );
  }
);

app.get("/profesor/courses/details/:courseId", verifyToken, (req, res) => {
  const courseId = req.params.courseId;

  const sqlQuery = `
    SELECT c.title, c.description, c.classes, c.course_path, COUNT(DISTINCT q.test_id) AS test_count, q.difficulty
    FROM courses c
    LEFT JOIN questions q ON c.id = q.course_id
    WHERE c.id = ?
    GROUP BY c.title, c.description, c.classes, c.course_path
  `;

  db.query(sqlQuery, [courseId], (error, results) => {
    if (error) {
      res.status(500).send({ error: "Internal Server Error" });
    } else {
      res.status(200).send(results);
    }
  });
});

app.get(
  "/profesor/courses/details/tests/:courseId",
  verifyToken,
  (req, res) => {
    const courseId = req.params.courseId;

    const sqlQuery = `
    SELECT
    test_id,
    difficulty,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'question', question,
        'answers', JSON_ARRAY(answer1, answer2, answer3, answer4),
        'correct_answer', correct_answer
      )
    ) AS questions
  FROM elearning.questions
  WHERE course_id = ?
  GROUP BY test_id
  ORDER BY difficulty DESC;
  
    
  
  `;

    db.query(sqlQuery, [courseId], (error, results) => {
      if (error) {
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.status(200).send(results);
      }
    });
  }
);
app.get(
  "/student/:userId/courses/details/tests/:courseId",
  verifyToken,
  (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.params.userId;

    const sqlQuery = `
    SELECT q.test_id, q.difficulty, GROUP_CONCAT(q.question) AS questions, ut.grade
    FROM questions q
    LEFT JOIN user_tests ut ON q.course_id = ut.course_id AND q.test_id = ut.test_id AND ut.user_id = ?
    WHERE q.course_id = ?
    GROUP BY q.test_id
    ORDER BY q.difficulty DESC
    
  `;

    db.query(sqlQuery, [userId, courseId], (error, results) => {
      if (error) {
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.status(200).send(results);
      }
    });
  }
);

app.delete("/admin/users/:userId", verifyToken, (req, res) => {
  const userId = req.params.userId;

  // Get the user's role
  db.query("SELECT role FROM user WHERE id = ?", [userId], (error, results) => {
    if (error) {
      console.error("Error fetching user's role:", error);
      res.status(500).json({ error: "Failed to fetch user's role" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const userRole = results[0].role;

    // Delete the user's user_answers
    db.query(
      "DELETE FROM user_answers WHERE user_id = ?",
      [userId],
      (error, results) => {
        if (error) {
          console.error("Error deleting user's user_answers:", error);
          res
            .status(500)
            .json({ error: "Failed to delete user's user_answers" });
          return;
        }

        // Delete the user's user_tests
        db.query(
          "DELETE FROM user_tests WHERE user_id = ?",
          [userId],
          (error, results) => {
            if (error) {
              console.error("Error deleting user's user_tests:", error);
              res
                .status(500)
                .json({ error: "Failed to delete user's user_tests" });
              return;
            }

            // Delete the user's questions (only for Profesor role)
            if (userRole === "Profesor") {
              // Fetch the courses uploaded by the user
              db.query(
                "SELECT id FROM courses WHERE user_id = ?",
                [userId],
                (error, results) => {
                  if (error) {
                    console.error("Error fetching user's courses:", error);
                    res
                      .status(500)
                      .json({ error: "Failed to fetch user's courses" });
                    return;
                  }

                  const courseIds = results.map((course) => course.id);

                  // Delete the user's questions associated with the courses
                  db.query(
                    "DELETE FROM questions WHERE course_id IN (?)",
                    [courseIds],
                    (error, results) => {
                      if (error) {
                        console.error(
                          "Error deleting user's questions:",
                          error
                        );
                        res
                          .status(500)
                          .json({ error: "Failed to delete user's questions" });
                        return;
                      }

                      // Delete the user's course access
                      db.query(
                        "DELETE FROM course_access WHERE course_id IN (?)",
                        [courseIds],
                        (error, results) => {
                          if (error) {
                            console.error(
                              "Error deleting user's course access:",
                              error
                            );
                            res.status(500).json({
                              error: "Failed to delete user's course access",
                            });
                            return;
                          }

                          // Delete the user's courses
                          db.query(
                            "DELETE FROM courses WHERE user_id = ?",
                            [userId],
                            (error, results) => {
                              if (error) {
                                console.error(
                                  "Error deleting user's courses:",
                                  error
                                );
                                res.status(500).json({
                                  error: "Failed to delete user's courses",
                                });
                                return;
                              }

                              // Delete the user
                              db.query(
                                "DELETE FROM user WHERE id = ?",
                                [userId],
                                (error, results) => {
                                  if (error) {
                                    console.error(
                                      "Error deleting user:",
                                      error
                                    );
                                    res
                                      .status(500)
                                      .json({ error: "Failed to delete user" });
                                  } else {
                                    res.json({
                                      message:
                                        "User and associated data deleted successfully",
                                    });
                                  }
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            } else {
              // Delete the user's course access
              db.query(
                "DELETE FROM course_access WHERE user_id = ?",
                [userId],
                (error, results) => {
                  if (error) {
                    console.error(
                      "Error deleting user's course access:",
                      error
                    );
                    res
                      .status(500)
                      .json({ error: "Failed to delete user's course access" });
                    return;
                  }

                  // Delete the user
                  db.query(
                    "DELETE FROM user WHERE id = ?",
                    [userId],
                    (error, results) => {
                      if (error) {
                        console.error("Error deleting user:", error);
                        res
                          .status(500)
                          .json({ error: "Failed to delete user" });
                      } else {
                        res.json({
                          message:
                            "User and associated data deleted successfully",
                        });
                      }
                    }
                  );
                }
              );
            }
          }
        );
      }
    );
  });
});

// app.delete("/admin/users/:userId", verifyToken, (req, res) => {
//   const userId = req.params.userId;

//   // Delete the user's tests
//   db.query(
//     "DELETE FROM questions WHERE course_id IN (SELECT id FROM courses WHERE user_id = ?)",
//     [userId],
//     (error, results) => {
//       if (error) {
//         console.error("Error deleting user's tests:", error);
//         res.status(500).json({ error: "Failed to delete user's tests" });
//         return;
//       }

//       // Delete the user's courses
//       db.query(
//         "DELETE FROM courses WHERE user_id = ?",
//         [userId],
//         (error, results) => {
//           if (error) {
//             console.error("Error deleting user's courses:", error);
//             res.status(500).json({ error: "Failed to delete user's courses" });
//             return;
//           }

//           // Delete the user
//           db.query(
//             "DELETE FROM user WHERE id = ?",
//             [userId],
//             (error, results) => {
//               if (error) {
//                 console.error("Error deleting user:", error);
//                 res.status(500).json({ error: "Failed to delete user" });
//               } else {
//                 res.json({
//                   message: "User and associated data deleted successfully",
//                 });
//               }
//             }
//           );
//         }
//       );
//     }
//   );
// });

app.put("/admin/users/:userId", verifyToken, (req, res) => {
  const userId = req.params.userId;
  const updatedUserData = req.body;

  const keys = Object.keys(req.body);
  if (keys.length === 1) {
    db.query(
      "UPDATE user SET state=? WHERE id = ?",
      [updatedUserData.state, userId],
      (error, results) => {
        if (error) {
          console.error("Error updating user:", error);
          res.status(500).json({ error: "Failed to update user" });
        } else {
          res.json({ message: "User updated successfully" });
        }
      }
    );
  } else {
    db.query(
      "UPDATE user SET firstname = ?, lastname = ?, email = ?, role = ?, password = ? WHERE id = ?",
      [
        updatedUserData.firstname,
        updatedUserData.lastname,
        updatedUserData.email,
        updatedUserData.role,
        updatedUserData.password,
        userId,
      ],
      (error, results) => {
        if (error) {
          console.error("Error updating user:", error);
          res.status(500).json({ error: "Failed to update user" });
        } else {
          res.json({ message: "User updated successfully" });
        }
      }
    );
  }
});

app.put(
  "/profesor/courses/updatecourse/:courseId",
  verifyToken,
  upload.single("course_path"),
  (req, res) => {
    const courseId = req.params.courseId;
    const updatedCourse = req.body;

    // Check if a new file is uploaded
    const coursePath = req.file ? req.file.path : null;

    const query =
      "UPDATE courses SET title = ?, description = ?, course_path = IFNULL(?, course_path), classes = ? WHERE id = ?";
    const values = [
      updatedCourse.title,
      updatedCourse.description,
      coursePath,
      updatedCourse.classes,
      courseId,
    ];

    db.query(query, values, (error, results) => {
      if (error) {
        console.log("Error updating course:", error);
        res.status(500).json({ error: "Failed to update course" });
      } else {
        res.status(200).json({ success: true });
      }
    });
  }
);

app.get("/admin/users", verifyToken, (req, res) => {
  db.query(
    "SELECT * FROM user where role !='admin' and state is null",
    (error, results) => {
      if (error) {
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.status(200).send(results);
      }
    }
  );
});
app.use(express.static("uploads"));

app.get("/admin/usersreq", verifyToken, (req, res) => {
  db.query("SELECT *  FROM user where state='pending'", (error, results) => {
    if (error) {
      res.status(500).send({ error: "Internal Server Error" });
    } else {
      res.status(200).send(results);
    }
  });
});

app.get("/user/getuserbyid/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM user where id = ?", [id], (error, results) => {
    if (error) {
      res.status(500).send({ error: "Internal Server Error" });
    } else {
      res.status(200).send(results);
    }
  });
});

// app.delete("/admin/users/:id", verifyToken, (req, res) => {
//   const userId = req.params.id;

//   db.query("DELETE FROM user WHERE id = ?", [userId], (error, result) => {
//     if (error) {
//       res.status(500).send({ error: "Internal Server Error" });
//     } else {
//       res.status(200).send({ message: "User deleted successfully" });
//     }
//   });
// });

app.get("/studentsCount", verifyToken, (req, res) => {
  const sql = "Select count(id) as students from user where role='Elev'";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in runnig query" });
    return res.json(result);
  });
});
app.get("/teachersCount", verifyToken, (req, res) => {
  const sql =
    "Select count(id) as teachers from user where role='Profesor' and state is null";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in runnig query" });
    return res.json(result);
  });
});

const __filename = fileURLToPath(import.meta.url);

// Get the directory path of the current module
const __dirname = dirname(__filename);

// Define the absolute path to the "uploads" directory
const uploadsPath = join(__dirname, "uploads");

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(uploadsPath));

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(uploadsPath));
app.listen(3001, () => {
  console.log("running server");
});
