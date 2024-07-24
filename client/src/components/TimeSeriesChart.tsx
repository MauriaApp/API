// src/components/TimeSeriesChart.tsx

import React, { useEffect, useState } from 'react';
import ChartComponent from './Chart';
import { fetchLogs } from '../services/logService';
import { ApexOptions } from 'apexcharts';

const TimeSeriesChart: React.FC = () => {
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
            const interval = 60 * 60 * 1000; // 1 heure

            // Agréger les logs par intervalle d'1 heure
            const aggregatedLogs = logs.reduce((acc, log) => {
                const roundedDate = roundDate(new Date(log.timestamp), interval).getTime();

                if (!acc[roundedDate]) {
                    acc[roundedDate] = 0;
                }

                acc[roundedDate] += 1;
                return acc;
            }, {} as Record<number, number>);

            // Préparer les données pour le graphique
            const timeData = Object.entries(aggregatedLogs).map(([x, y]) => ({
                x: parseInt(x, 10),
                y: y
            }));

            setOptions({
                chart: {
                    id: 'time-series-chart',
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
                    text: 'Nombre de logs au fil du temps',
                    align: 'center'
                }
            });

            setSeries([
                {
                    name: 'Logs',
                    data: timeData
                }
            ]);
        };

        getData();
    }, []);

    return (
        <ChartComponent title="Graphique Temporel des Logs" options={options} series={series} type="line" />
    );
};

export default TimeSeriesChart;
