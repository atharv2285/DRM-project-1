
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ChartDataPoint } from '../../types';

interface GreeksChartProps {
  data: ChartDataPoint[];
  xAxisKey: string;
  yAxisKeyCall: string;
  yAxisKeyPut: string;
  xAxisLabel: string;
  yAxisDomain?: [number, number];
  callLabel?: string;
  putLabel?: string;
  showPut?: boolean;
}

const GreeksChart: React.FC<GreeksChartProps> = ({ 
    data, 
    xAxisKey, 
    yAxisKeyCall, 
    yAxisKeyPut, 
    xAxisLabel, 
    yAxisDomain, 
    callLabel = 'Call',
    putLabel = 'Put',
    showPut = true
}) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis 
            dataKey={xAxisKey} 
            tick={{ fill: '#A0AEC0', fontSize: 12 }} 
            label={{ value: xAxisLabel, position: 'insideBottom', offset: -15, fill: '#CBD5E0' }}
            tickFormatter={(value) => typeof value === 'number' ? value.toFixed(2) : value}
          />
          <YAxis 
            tick={{ fill: '#A0AEC0', fontSize: 12 }}
            domain={yAxisDomain}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568', color: '#E2E8F0' }} 
            formatter={(value: number) => value.toFixed(4)}
          />
          <Legend wrapperStyle={{fontSize: "14px"}}/>
          <Line type="monotone" dataKey={yAxisKeyCall} stroke="#48BB78" strokeWidth={2} dot={false} name={callLabel}/>
          {showPut && <Line type="monotone" dataKey={yAxisKeyPut} stroke="#F56565" strokeWidth={2} dot={false} name={putLabel}/>}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GreeksChart;
