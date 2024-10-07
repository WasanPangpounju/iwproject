import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmployeeAbilityGraph = ({ employees }) => {
  const abilityCount = aggregateAbilities(employees);

  const data = {
    labels: Object.keys(abilityCount),
    datasets: [
      {
        label: '# of Employees with Ability',
        data: Object.values(abilityCount),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Employees by Ability',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

const aggregateAbilities = (employees) => {
  const abilityCount = {};

  employees.forEach((employee) => {
    employee.ability.forEach((ability) => {
      if (abilityCount[ability]) {
        abilityCount[ability]++;
      } else {
        abilityCount[ability] = 1;
      }
    });
  });

  return abilityCount;
};

export default EmployeeAbilityGraph;
