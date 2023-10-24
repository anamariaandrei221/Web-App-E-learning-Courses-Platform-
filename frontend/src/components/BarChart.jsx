import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ courseData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 10,
          textWrap: "wrap",
          maxWidth: null, // Set maxWidth to null or a higher value
        },
      },
      title: {
        display: true,
        text: "Număr utilizatori care au accesat cursurile",
      },
    },
  };

  const datasets = courseData.map((course) => {
    const backgroundColor = `rgba(${getRandomNumber(0, 255)}, ${getRandomNumber(
      0,
      255
    )}, ${getRandomNumber(0, 255)}, 0.5)`;
    return {
      label: course.title,
      data: [course.access_count],
      backgroundColor,
    };
  });

  const data = {
    labels: ["Număr utilizatori"],
    datasets,
  };

  return <Bar options={options} data={data} />;
}

// Function to generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
