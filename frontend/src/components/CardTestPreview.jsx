import React from "react";

export default function CardTestPreview({
  questionsNumber,
  classes,
  title,
  difficulty,
  showTest,
  id,
}) {
  let difficultyColor = "";

  switch (difficulty) {
    case "usor":
      difficultyColor = "green"; // Set the color for "usor" difficulty
      break;
    case "mediu":
      difficultyColor = "rgb(255, 102, 0)"; // Set the color for "mediu" difficulty
      break;
    case "greu":
      difficultyColor = "red"; // Set the color for "greu" difficulty
      break;
    // Set a default color if difficulty is unknown
  }

  return (
    <button
      className="card--course"
      onClick={() => {
        showTest(id);
      }}
    >
      <div className="classes--div--design">Clasa {classes}</div>
      <div
        className="test--div--design"
        style={{ backgroundColor: difficultyColor }}
      >
        {difficulty}
      </div>
      <div className="card--course--details">
        <h6>{title}</h6>
        <p>Număr întrebări: {questionsNumber}</p>
      </div>
    </button>
  );
}
