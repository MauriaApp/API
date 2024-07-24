// src/components/MultiTimeSeriesChart.tsx

import React, { useEffect, useState } from 'react';
import ChartComponent from './Chart';
import { fetchLogs } from '../services/logService';
import { ApexOptions } from 'apexcharts';

const MultiTimeSeriesChart: React.FC = () => {
    const [series, setSeries] = useState<ApexOptions['series']>([]);
    const [options, setOptions] = useState<ApexOptions>({});

    useEffect(() => {
        const getData = async () => {
            const logs = await fetchLogs();

            // Fonction pour arrondir une date à l'intervalle le plus proche
            const roundDate = (date: Date, interval: number) => {
                const time = date.getTime();
                return new Date(Math.floor(time / interval) * interval);
            };

            // Intervalle de temps (en millisecondes)
            const interval = 30 * 60 * 1000; // 30 minutes

            // Agréger les logs par intervalle de 30 minutes
            const routeCounts = logs.reduce((acc, log) => {
                const roundedDate = roundDate(new Date(log.timestamp), interval).getTime();
                const url = log.url || 'UNKNOWN';

                if (!acc[url]) {
                    acc[url] = {};
                }

                if (!acc[url][roundedDate]) {
                    acc[url][roundedDate] = 0;
                }

                acc[url][roundedDate] += 1;
                return acc;
            }, {} as Record<string, Record<number, number>>);

            // Préparer les données pour le graphique
            const seriesData = Object.keys(routeCounts).map(route => ({
                name: route,
                data: Object.entries(routeCounts[route]).map(([x, y]) => ({
                    x: parseInt(x, 10),
                    y: y
                }))
            }));

            setOptions({
                chart: {
                    id: 'multi-time-series-chart',
                    type: 'line',
                    zoom: {
                        enabled: true
                    }
                },
                xaxis: {
                    type: 'datetime',
                    title: {
                        text: 'Temps'
                    }
                },
                yaxis: {
                    title: {
                        text: 'Nombre de logs'
                    }
                },
                title: {
                    text: 'Nombre de logs par route au fil du temps',
                    align: 'center'
                },
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    offsetX: 40,
                    onItemClick: {
                        toggleDataSeries: true
                    }
                }
            });

            setSeries(seriesData);
        };

        getData();
    }, []);

    return (
        <ChartComponent title="Graphique Temporel des Logs par Route" options={options} series={series} type="line" />
    );
};

export default MultiTimeSeriesChart;
