import React from "react";
export default function Card({
  title,
  description,
  classes,
  id,
  showPdf,
  firstname,
  lastname,
  last_access,
}) {
  const calculateHourDifference = () => {
    if (last_access) {
      const currentDate = new Date();
      const lastAccessDate = new Date(last_access);
      const timeDifference = currentDate.getTime() - lastAccessDate.getTime();
      const hourDifference = Math.floor(timeDifference / (1000 * 60 * 60));
      return hourDifference;
    }
    return null;
  };
  return (
    <button
      className="card--course"
      onClick={() => showPdf(id, firstname, lastname)}
    >
      <div className="classes--div--design">Clasa {classes}</div>

      <div className="card--course--details">
        <h6>{title}</h6>
        <p>{description}</p>
      </div>
      {last_access && (
        <div style={{ fontSize: "11px" }}>
          Ai accesat acest curs acum {calculateHourDifference()} ore
        </div>
      )}
    </button>
  );
}
