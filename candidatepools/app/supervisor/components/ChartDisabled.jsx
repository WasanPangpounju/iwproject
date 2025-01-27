// components/BarChart.js
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// ลงทะเบียน ChartJS components ที่ใช้
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

//manage chart
const BarChart = ({d1, d2, d3, d4, d5, d6, d7, allStudents}) => {
    const labels = ['พิการทางการเห็น', 'พิการทางการได้ยินหรือสื่อความหมาย', 'พิการทางการเคลื่อนไหวหรือทางร่างกาย', 'พิการทางจิตใจหรือพฤติดรรม', 'พิการทางสติปัญญา', 'พิการทางการเรียนรู้', 'พิการทางออทิสติก'];
    const data = {
        labels: labels,
        datasets: [{
            axis: 'y',
            label: `จำนวนความพิการของนักศึกษา`,
            data: [d1, d2, d3, d4, d5, d6, d7],
            fill: false,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y',
            maintainAspectRatio: false, // ป้องกันไม่ให้กราฟรักษาสัดส่วนเดิม
        },
    };

    return (
        <Bar
            data={data}
            options={config.options}
            height={400}
        />
    );
};

export default BarChart;