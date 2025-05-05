import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const UniversityChart = ({ employees }) => {
  const universityCount = aggregateUniversities(employees);
  const totalEmployees = employees.length;  // Total number of employees

  const data = {
    labels: Object.keys(universityCount),  // University names
    datasets: [
      {
        label: '# of Employees per University',
        data: Object.values(universityCount),  // Employee counts per university
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Employees by University',
      },
      datalabels: {
        formatter: (value, context) => {
          const percentage = ((value / totalEmployees) * 100).toFixed(2);  // Calculate percentage
          return `${context.chart.data.labels[context.dataIndex]}: ${percentage}%`;  // Display university name and percentage
        },
        color: '#000',  // Label text color
        font: {
          weight: 'bold',
        }
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

const aggregateUniversities = (employees) => {
  const universityCount = {};

  employees.forEach((employee) => {
    if (universityCount[employee.university]) {
      universityCount[employee.university]++;
    } else {
      universityCount[employee.university] = 1;
    }
  });

  return universityCount;
};

export default UniversityChart;
