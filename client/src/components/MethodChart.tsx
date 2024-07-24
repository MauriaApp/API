import React, { useEffect, useState } from 'react';
import ChartComponent from './Chart';
import { fetchLogs } from '../services/logService';

const MethodChart: React.FC = () => {
    const [series, setSeries] = useState<ApexCharts.ApexOptions['series']>([]);
    const [options, setOptions] = useState<ApexCharts.ApexOptions>({});

    useEffect(() => {
        const getData = async () => {
            const logs = await fetchLogs();
            const methodCounts = logs.reduce((acc, log) => {
                const method = log.method || 'UNKNOWN';
                acc[method] = (acc[method] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const categories = Object.keys(methodCounts);
            const data = categories.map(method => methodCounts[method]);

            setOptions({
                chart: {
                    id: 'method-chart'
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
        <ChartComponent title="Logs par Méthode" options={options} series={series} type="bar" />
    );
};

export default MethodChart;
