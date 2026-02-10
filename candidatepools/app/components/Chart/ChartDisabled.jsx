import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dataDisabled from "@/assets/dataDisabled";

// ลงทะเบียน ChartJS components ที่ใช้
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const BarChart = ({ d1, d2, d3, d4, d5, d6, d7, d8, allStudents }) => {
  const rawData = [d1, d2, d3, d4, d5, d6, d7, d8];
  const sum = rawData.reduce((a, b) => a + b, 0);

  const data = {
    labels: dataDisabled.map((item) => {
      return item;
    }),
    datasets: [
      {
        label: "จำนวนนักศึกษาพิการ",
        data: rawData,
        backgroundColor: [
          "#ffa152",
          "#74c7c2",
          "#ffc0c1",
          "#ffd576",
          "#80b4f8",
          "#76cda1",
          "#998fff",
        ],
        borderRadius: 10, // มุมโค้งสวย ๆ
        barThickness: 25, // ความหนาของแท่ง
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // เอา legend ออกให้สะอาด
      },
      datalabels: {
        color: "#333",
        anchor: "end",
        align: "end",
        font: {
          weight: "bold",
          size: 13,
        },
        formatter: (value) => {
          const percent =
            sum > 0 ? ((value / sum) * 100).toFixed(1) + "%" : "0%";
          return `${value} (${percent})`;
        },
      },
    },
    indexAxis: "y",
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        max: allStudents || undefined, // ให้ chart max scale ตาม total ถ้ากำหนด
        grid: {
          color: "#f0f0f0",
        },
        ticks: {
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 13,
            weight: "600",
          },
        },
      },
    },
  };

  return (
    <div className="w-full " style={{ minHeight: `${rawData.length * 80}px` }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;

// // components/BarChart.js
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// // import { mdiBorderRadius } from "@mdi/js";

// // ลงทะเบียน ChartJS components ที่ใช้
// ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// //manage chart
// const PieChart = ({ d1, d2, d3, d4, d5, d6, d7 }) => {
//   const rawData = [d1, d2, d3, d4, d5, d6, d7];
//   const sum = rawData.reduce((a, b) => a + b, 0);
//   const data = {
//     labels: [
//       `พิการทางการมองเห็น`,
//       "พิการทางการได้ยินหรือสื่อความหมาย",
//       "พิการทางการเคลื่อนไหวหรือทางร่างกาย",
//       "พิการทางจิตใจหรือพฤติกรรม",
//       "พิการทางสติปัญญา",
//       "พิการทางการเรียนรู้",
//       "พิการทางออทิสติก",
//     ].map((label, i) => {
//       const value = rawData[i];
//       const percent = sum > 0 ? ((value / sum) * 100).toFixed(1) : 0;
//       return `${label} ${value} คน (${percent}%)`;
//     }),
//     datasets: [
//       {
//         label: "จำนวนนักศึกษาพิการ",
//         data: [d1, d2, d3, d4, d5, d6, d7],
//         backgroundColor: [
//           "#ffa152",
//           "#74c7c2",
//           "#ffc0c1",
//           "#ffd576",
//           "#80b4f8",
//           "#76cda1",
//           "#998fff",
//         ],
//         hoverOffset: 4,
//       },
//     ],
//   };

//   const options = {
//     plugins: {
//       legend: {
//         position: "left", // วางแถบกำกับที่ด้านขวาของกราฟ
//         labels: {
//           boxWidth: 20, // ขนาดของสัญลักษณ์ในแถบกำกับ
//           padding: 30, // ระยะห่างระหว่างสัญลักษณ์และชื่อ
//           font: {
//             size: 17, // ขนาดตัวอักษร
//             weight: "bold",
//             family: "Arial",
//           },
//           boxWidth: 15, // ขนาดกล่องสี
//           boxHeight: 15,
//           usePointStyle: true, // ใช้ style เป็นวงกลม/สามเหลี่ยม
//           pointStyle: "circle", // 'circle', 'rect', 'rectRounded', 'line', etc.
//         },
//       },
//       datalabels: {
//         color: "black", // กำหนดสีตัวหนังสือ
//         anchor: "center",
//         align: "center",
//         font: {
//           weight: "bold",
//           size: 15,
//         },
//         formatter: (value, ctx) => {
//           const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
//           const percent = ((value / total) * 100).toFixed(1) + "%";
//           return `${value}\n${percent}`;
//         },
//       },
//     },
//     indexAxis: "y", // แนวแกนเป็นแนวนอน
//     maintainAspectRatio: false, // ไม่รักษาสัดส่วนเดิมของกราฟ
//   };

//   return <Pie data={data} height={400} options={options} />;
// };

// export default PieChart;
