import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { StrategyResult } from '../../types';

interface CumulativeReturnChartProps {
  data: StrategyResult[];
}

const CumulativeReturnChart: React.FC<CumulativeReturnChartProps> = ({ data }) => {
  
  const colors = ["#F97316", "#4A5568", "#A0AEC0"];

  // Merge data for recharts
  const chartData = data[0].cumulativeReturns.map((cr, index) => {
    const entry: { [key: string]: number | string } = { month: cr.month };
    data.forEach(strategy => {
      entry[strategy.name] = strategy.cumulativeReturns[index].value;
    });
    return entry;
  });

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#4A5568', fontSize: 12 }} 
            label={{ value: 'Month', position: 'insideBottom', offset: -15, fill: '#4A5568' }}
          />
          <YAxis 
            tick={{ fill: '#4A5568', fontSize: 12 }}
            label={{ value: 'Portfolio Value', angle: -90, position: 'insideLeft', fill: '#4A5568', dx: 10 }}
            tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E0', color: '#1A202C' }} 
            formatter={(value: number, name: string) => [`$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, name]}
            labelFormatter={(label: number) => `End of Month: ${label}`}
          />
          <Legend wrapperStyle={{fontSize: "14px"}}/>
          {data.map((strategy, index) => (
            <Line 
              key={strategy.name}
              type="monotone" 
              dataKey={strategy.name} 
              stroke={colors[index % colors.length]} 
              strokeWidth={2} 
              dot={false} 
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CumulativeReturnChart;
