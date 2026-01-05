import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import './Charts.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Default chart options
const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#F8FAFC',
            bodyColor: '#94A3B8',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: false
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(51, 65, 85, 0.3)',
                borderColor: '#334155'
            },
            ticks: {
                color: '#64748B',
                font: {
                    size: 11
                }
            }
        },
        y: {
            grid: {
                color: 'rgba(51, 65, 85, 0.3)',
                borderColor: '#334155'
            },
            ticks: {
                color: '#64748B',
                font: {
                    size: 11
                }
            }
        }
    }
};

// Line Chart Component
export function LineChart({ data, options = {}, title, subtitle }) {
    const chartData = {
        labels: data.labels,
        datasets: data.datasets.map((dataset, idx) => ({
            ...dataset,
            borderColor: dataset.borderColor || getChartColor(idx),
            backgroundColor: dataset.fill
                ? `${getChartColor(idx)}20`
                : 'transparent',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: dataset.borderColor || getChartColor(idx),
            pointBorderColor: '#1E293B',
            pointBorderWidth: 2,
            pointHoverRadius: 6
        }))
    };

    return (
        <div className="chart-container">
            {title && (
                <div className="chart-header">
                    <h3 className="chart-title">{title}</h3>
                    {subtitle && <p className="chart-subtitle">{subtitle}</p>}
                </div>
            )}
            <div className="chart-wrapper">
                <Line data={chartData} options={{ ...defaultOptions, ...options }} />
            </div>
        </div>
    );
}

// Bar Chart Component
export function BarChart({ data, options = {}, title, subtitle, horizontal = false }) {
    const chartData = {
        labels: data.labels,
        datasets: data.datasets.map((dataset, idx) => ({
            ...dataset,
            backgroundColor: dataset.backgroundColor || getChartColor(idx),
            borderColor: dataset.borderColor || getChartColor(idx),
            borderWidth: 0,
            borderRadius: 6,
            barThickness: 'flex',
            maxBarThickness: 40
        }))
    };

    const chartOptions = {
        ...defaultOptions,
        ...options,
        indexAxis: horizontal ? 'y' : 'x'
    };

    return (
        <div className="chart-container">
            {title && (
                <div className="chart-header">
                    <h3 className="chart-title">{title}</h3>
                    {subtitle && <p className="chart-subtitle">{subtitle}</p>}
                </div>
            )}
            <div className="chart-wrapper">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

// Doughnut Chart Component
export function DoughnutChart({ data, options = {}, title, subtitle, showLegend = true }) {
    const chartData = {
        labels: data.labels,
        datasets: [{
            data: data.values,
            backgroundColor: data.colors || data.labels.map((_, idx) => getChartColor(idx)),
            borderColor: '#1E293B',
            borderWidth: 3,
            hoverOffset: 4
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                display: showLegend,
                position: 'bottom',
                labels: {
                    color: '#94A3B8',
                    padding: 16,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                ...defaultOptions.plugins.tooltip
            }
        },
        ...options
    };

    return (
        <div className="chart-container doughnut-chart">
            {title && (
                <div className="chart-header">
                    <h3 className="chart-title">{title}</h3>
                    {subtitle && <p className="chart-subtitle">{subtitle}</p>}
                </div>
            )}
            <div className="chart-wrapper">
                <Doughnut data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

// Pie Chart Component
export function PieChart({ data, options = {}, title, subtitle, showLegend = true }) {
    const chartData = {
        labels: data.labels,
        datasets: [{
            data: data.values,
            backgroundColor: data.colors || data.labels.map((_, idx) => getChartColor(idx)),
            borderColor: '#1E293B',
            borderWidth: 2
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: showLegend,
                position: 'bottom',
                labels: {
                    color: '#94A3B8',
                    padding: 16,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                ...defaultOptions.plugins.tooltip
            }
        },
        ...options
    };

    return (
        <div className="chart-container">
            {title && (
                <div className="chart-header">
                    <h3 className="chart-title">{title}</h3>
                    {subtitle && <p className="chart-subtitle">{subtitle}</p>}
                </div>
            )}
            <div className="chart-wrapper">
                <Pie data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

// Helper function to get chart colors
function getChartColor(index) {
    const colors = [
        '#0077B6', // Primary blue
        '#00C49A', // Secondary green
        '#7C3AED', // Accent purple
        '#F59E0B', // Warning orange
        '#EF4444', // Error red
        '#3B82F6', // Info blue
        '#10B981', // Success green
        '#EC4899'  // Pink
    ];
    return colors[index % colors.length];
}

export default { LineChart, BarChart, DoughnutChart, PieChart };
