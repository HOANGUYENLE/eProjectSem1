import React from "react";
import { Doughnut } from "react-chartjs-2";

const PieChart = ({value, label}) => {
    const data = {
        labels: label,
        datasets: [{data:value,
                backgroundColor: ['#30cd00', '#cddc00', '#c82f00'],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 12,}]};
    const option = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '0%',
        plugins: { 
            legend: {
                position: 'top',
                align: 'center',
                labels: { padding: 20, font: { size: 10 }, usePointStyle: true }
            }, 
            tooltip: {
            backgroundColor: '#0A1428',
            padding: 14,
            titleFont: { size: 14 },
            bodyFont: { size: 13 }
            }
        }}
    return ( <> <Doughnut data={data} options={option}/> </> )
}

export default PieChart;