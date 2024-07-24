import React from 'react';
import Chart from 'react-apexcharts';

interface ChartProps {
    title: string;
    options: ApexCharts.ApexOptions;
    series: ApexCharts.ApexOptions['series'];
    type: "line" | "area" | "bar" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "rangeArea" | "treemap" | undefined;
}

const ChartComponent: React.FC<ChartProps> = ({ title, options, series, type }) => {
    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl mb-4">{title}</h2>
            <Chart options={options} series={series} type={type} height={350} />
        </div>
    );
};

export default ChartComponent;
