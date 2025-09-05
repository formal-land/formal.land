import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend);

type Point = {
  date: string;
  linkPct: number;
  simulatePct: number;
};

export default function ProgressChart({ data }: { data: Point[] }) {
  const chartData = {
    datasets: [
      {
        label: '% link',
        data: data.map(p => ({ x: p.date, y: p.linkPct })),
        borderColor: 'rgb(99,102,241)',
      },
      {
        label: '% simulate',
        data: data.map(p => ({ x: p.date, y: p.simulatePct })),
        borderColor: 'rgb(16,185,129)', 
      },
    ],
  };

  console.log(chartData);

  const options = {
    // parsing: false,
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'nearest', intersect: false },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'week' },
        title: { display: true, text: 'Date' },
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Percent',
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div style={{ height: 360 }}>
      <Line data={chartData} options={options as any} />
    </div>
  );
}
