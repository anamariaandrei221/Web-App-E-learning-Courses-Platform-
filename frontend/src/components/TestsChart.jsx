import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TestsChart({ testData }) {
  const grades = testData.test_grades.split(","); // Convert the test_grades string to an array of grades

  // Count the occurrences of each grade
  const gradeCounts = {};
  grades.forEach((grade) => {
    gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
  });

  // Generate random colors for each grade
  const colors = generateRandomColors(Object.keys(gradeCounts).length);

  const data = {
    labels: Object.keys(gradeCounts), // Use the grades as labels
    datasets: [
      {
        label: "Elevi",
        data: Object.values(gradeCounts), // Use the grade counts as data
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ height: "200px" }}>
      <Pie
        data={data}
        options={{
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}

// Function to generate random colors
function generateRandomColors(numColors) {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const color = `rgb(${getRandomValue(0, 255)}, ${getRandomValue(
      0,
      255
    )}, ${getRandomValue(0, 255)})`;
    colors.push(color);
  }
  return colors;
}

// Function to generate a random value within a range
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
