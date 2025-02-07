// components/BarChart.js
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { mdiBorderRadius } from '@mdi/js';

// ลงทะเบียน ChartJS components ที่ใช้
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

//manage chart
const PieChart = ({ d1, d2, d3, d4, d5, d6, d7, allStudents }) => {
    const data = {
        labels:['พิการทางการมองเห็น', 'พิการทางการได้ยินหรือสื่อความหมาย', 'พิการทางการเคลื่อนไหวหรือทางร่างกาย', 'พิการทางจิตใจหรือพฤติดรรม', 'พิการทางสติปัญญา', 'พิการทางการเรียนรู้', 'พิการทางออทิสติก'],
        datasets: [{
            label: 'จำนวนนักศึกษาพิการ',
            data: [d1, d2, d3, d4, d5, d6, d7],
            backgroundColor: [
                '#ffa152',
                '#74c7c2',
                '#ffc0c1',
                '#ffd576',
                '#80b4f8',
                '#76cda1',
                '#998fff',
            ],
            hoverOffset: 4
        }]
    };

    const options = {
        plugins: {
            legend: {
                position: 'left', // วางแถบกำกับที่ด้านขวาของกราฟ
                labels: {
                    boxWidth: 20, // ขนาดของสัญลักษณ์ในแถบกำกับ
                    padding: 30, // ระยะห่างระหว่างสัญลักษณ์และชื่อ
                    font: {
                        size: 17, // ขนาดตัวอักษร
                    },
                },
            },
            datalabels: {
                color: '#fff', // กำหนดสีตัวหนังสือ
                anchor: 'center',
                align: 'center',
                font: {
                    weight: 'bold',
                    size: 10,
                },
                formatter: (value, ctx) => {
                    let sum = ctx.dataset.data.reduce((a, b) => a + b, 0); // คำนวณผลรวมของค่าใน dataset
                    let percentage = ((value / sum) * 100).toFixed(1) + "%"; // คำนวณเปอร์เซ็นต์
                    return `${value}\n${percentage}`; // แสดงทั้งจำนวนและเปอร์เซ็นต์
                },
            },
        },
        indexAxis: 'y', // แนวแกนเป็นแนวนอน
        maintainAspectRatio: false, // ไม่รักษาสัดส่วนเดิมของกราฟ
    };

    return (
        <Pie
            data={data}
            height={600}
            options={options}
        />
    );
};

export default PieChart;