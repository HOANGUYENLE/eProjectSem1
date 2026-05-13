import React from "react";
import { Line } from "react-chartjs-2";

export default function LineChart({datasets, labels}){
    const data = {
        labels: labels,
        datasets: datasets
    };
    const option = {
        responsive: true,
        maintainAspectRatio: false,
  
        plugins: { 
            legend: {
                position: 'top',
                align: 'center',
                labels: { padding: 15, font: { size: 10 }, usePointStyle: true }
            }, 
            tooltip: {
            mode: 'index',
            intersect:false,
            backgroundColor: '#0A1428',
            padding: 14},
            scales: {
                x: {
                    grid: { color: "#E2E8F0", lineWidth: 0.8 },
                    ticks: { color: "#64748B", font: { size: 12 } }},
                y: {
                    beginAtZero: true,
                    grid: { color: "#E2E8F0" },
                    ticks: { color: "#64748B", font: { size: 12 } }}
            }
        }
    };
    return (
        <><Line data={data} options={option}/></>
    )
}