import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
export default function UserChart({ studentCount, teacherCount }) {
  const data = {
    labels: ["Elevi", "Profesori"],
    datasets: [
      {
        label: "Număr utilizatori",
        data: [studentCount, teacherCount],
        backgroundColor: ["rgb(112, 219, 112)", "rgb(255, 219, 77)"],
        borderColor: ["rgb(46, 184, 46)", "rgb(255, 204, 0)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Pie
      data={data}
      options={{
        maintainAspectRatio: false,
      }}
    />
  );
}
