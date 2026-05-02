import { Chart } from "react-chartjs-2";

export default function LineStackBar({datasets, labels}){
    const monthlyLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const data = {
        labels: monthlyLabels,
        datasets: [
            {
                type: "bar",
                label: labels.success,
                data: datasets.success,
                backgroundColor: "#22C55E",
                stack: "stack0"
            },
            {
                type: "bar",
                label: labels.cancel,
                data: datasets.cancel,
                backgroundColor: "#EF4444",
                stack: "stack0"
            },
            {
                type: "line",
                label: labels.total,
                data: datasets.total,
                borderColor: "#0EA5E9",
                backgroundColor: "#0EA5E9",
                fill: false,
                tension: 0,
                yAxisID: "y"
            }
        ]
    }

    const option = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend:{
                position: "top",
                align: "center",
                labels: { padding: 15, font: { size: 13 }, usePointStyle: true},
            },
            tooltip: {
                mode: "index",intersect: false
            },
        },
        barThickness: 28,
        borderRadius: 6,
        scales: {
            x: {
                stacked: true
            }, 
            y: {
                stacked: true,
                beginAtZero: true
            }
        }
    }


    return(<>
        <Chart data={data} options={option}/>
    </>)
}