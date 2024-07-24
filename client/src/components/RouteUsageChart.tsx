// src/components/RouteUsageChart.tsx

import React, { useEffect, useState } from 'react';
import ChartComponent from './Chart';
import { fetchLogs } from '../services/logService';
import { ApexOptions } from 'apexcharts';

const RouteUsageChart: React.FC = () => {
    const [series, setSeries] = useState<ApexOptions['series']>([]);
    const [options, setOptions] = useState<ApexOptions>({});

    useEffect(() => {
        const getData = async () => {
            const logs = await fetchLogs();
            const routeCounts = logs.reduce((acc, log) => {
                const url = log.url || 'UNKNOWN';
                acc[url] = (acc[url] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            // Tri par nombre d'occurrences décroissant
            const sortedRoutes = Object.keys(routeCounts).sort((a, b) => routeCounts[b] - routeCounts[a]);

            // Prendre les 5 premières routes ou toutes si moins de 5
            const topRoutes = sortedRoutes.slice(0, 5);

            const categories = topRoutes;
            const data = topRoutes.map(route => routeCounts[route]);

            setOptions({
                chart: {
                    id: 'route-usage-chart'
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
        <ChartComponent title="Routes les Plus Utilisées" options={options} series={series} type="bar" />
    );
};

export default RouteUsageChart;
