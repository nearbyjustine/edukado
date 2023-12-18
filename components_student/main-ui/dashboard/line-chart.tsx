import { faker } from "@faker-js/faker";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const options: any = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Grade 1 Maharlika Average Scores for Quarter 1",
    },
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: true,
        },
        scaleLabel: {
          display: true,
          labelString: "Month",
          color: "#ffffff",
        },
      },
    ],
    yAxes: [
      {
        display: true,
        gridLines: {
          display: true,
          color: "#ffffff",
        },
        scaleLabel: {
          display: true,
          labelString: "Value",
        },
      },
    ],
  },
};

const data = {
  labels,
  datasets: [
    {
      label: "Mathematics",
      data: labels.map(() => faker.number.int({ min: 85, max: 95 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Science",
      data: labels.map(() => faker.number.int({ min: 85, max: 95 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
    {
      label: "English",
      data: labels.map(() => faker.number.int({ min: 85, max: 95 })),
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgb(75, 192, 192)",
    },
  ],
};

export const LineChartStudents = () => {
  return <Line options={options} data={data} />;
};
