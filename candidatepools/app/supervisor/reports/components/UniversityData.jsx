"use client"

import React, { useState, useEffect } from 'react'

import Stack from '@mui/material/Stack';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Box, Typography } from "@mui/material";

const CustomLegend = ({ data }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection:"column", flexWrap: 'wrap', }}>
            {data.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', fontSize: '1px' }}>
                    <Box sx={{ width: 16, height: 16, backgroundColor: item.color, marginRight: 1 }} />
                    <Typography sx={{fontSize:"14px"}}>{item.label} : {item.value}</Typography>
                </Box>
            ))}
        </Box>
    );
};

function UniversityData({ universitys }) {
    const universityShow = universitys?.find(uni => uni?.year === "all");
    const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    let pieData = [];
    
    if (universityShow?.data) {
        const sortedData = [...universityShow.data].sort((a, b) => 
            (b.student + b.graduation) - (a.student + a.graduation)
        ); // เรียงลำดับข้อมูลจากมากไปน้อย

        const top6 = sortedData.slice(0, 6); // เอาแค่ 6 อันดับแรก
        const others = sortedData.slice(6); // ที่เหลือรวมกัน

        pieData = top6.map((uni, index) => ({
            label: uni.university,
            value: uni.student + uni.graduation,
            color: COLORS[index % COLORS.length],
        }));

        if (others.length > 0) {
            const othersTotal = others.reduce((sum, uni) => sum + (uni.student + uni.graduation), 0);
            pieData.push({
                label: "อื่นๆ",
                value: othersTotal,
                color: "#CCCCCC", // กำหนดสีเทาสำหรับ "อื่นๆ"
            });
        }
    }

    const pieParams = {
        slotProps: { legend: { hidden: true } },
    };

    return (
        <div className='mt-10 flex flex-col gap-10'>
            <Stack direction="row" width="100%" textAlign="center" spacing={2}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <PieChart
                        series={[
                            {
                                arcLabel: (item) => `${item.value} คน`,
                                data: pieData,
                            },
                        ]}
                        {...pieParams}
                        sx={{
                            marginTop: "10px",
                        }}
                        width={700}
                        height={500}
                    />
                </Box>
            </Stack>
            <CustomLegend data={pieData} />
        </div>
    );
}


export default UniversityData
