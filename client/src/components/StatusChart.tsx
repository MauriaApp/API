import React, { useEffect, useState } from 'react';
import ChartComponent from './Chart';
import { fetchLogs } from '../services/logService';

const StatusChart: React.FC = () => {
    const [series, setSeries] = useState<ApexCharts.ApexOptions['series']>([]);
    const [options, setOptions] = useState<ApexCharts.ApexOptions>({});

    useEffect(() => {
        const getData = async () => {
            const logs = await fetchLogs();
            const statusCounts = logs.reduce((acc, log) => {
                const status = log.statusCode || 'UNKNOWN';
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const categories = Object.keys(statusCounts);
            const data = categories.map(status => statusCounts[status]);

            setOptions({
                chart: {
                    id: 'status-chart'
                },
                xaxis: {
                    categories
                }
            });

            setSeries([
                {
                    name: 'Logs',
                    data
                }
            ]);
        };

        getData();
    }, []);

    return (
        <ChartComponent title="Logs par Statut HTTP" options={options} series={series} type="bar" />
    );
};

export default StatusChart;
