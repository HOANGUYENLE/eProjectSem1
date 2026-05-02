import { plugins } from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

export default function BarChart({labels, datasets}){
    const data = {
        labels: labels,
        datasets: datasets
    }
    const option = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend:{
                position: "bottom",
                align: "start",
                labels: { padding: 15, font: { size: 13 }, usePointStyle: true},
            },
            tooltip: {
                backgroundColor: "#0A1428",
                padding: 14,
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
            },
        },
        barThickness: 28,
        borderRadius: 6,
    }
    return (<><Bar data={data} options={option}/></>)
}