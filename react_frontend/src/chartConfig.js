import { Chart as ChartJS, 
    ArcElement, Tooltip, 
    Legend, CategoryScale, 
    LinearScale, PointElement, 
    LineElement, BarElement } from 'chart.js';
import { Chart } from 'react-chartjs-2';
ChartJS.register(
    ArcElement, Tooltip, 
    Legend, CategoryScale, 
    LinearScale, PointElement, 
    LineElement, BarElement
);
export default ChartJS;