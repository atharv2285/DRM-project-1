
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { PayoffDataPoint } from '../../types';

interface PayoffChartProps {
  data: PayoffDataPoint[];
}

const PayoffChart: React.FC<PayoffChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis 
            dataKey="stockPrice" 
            type="number"
            domain={['dataMin', 'dataMax']}
            tick={{ fill: '#A0AEC0', fontSize: 12 }} 
            label={{ value: 'Stock Price at Expiry', position: 'insideBottom', offset: -15, fill: '#CBD5E0' }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <YAxis 
            tick={{ fill: '#A0AEC0', fontSize: 12 }}
            label={{ value: 'Profit / Loss', angle: -90, position: 'insideLeft', fill: '#CBD5E0', dx: -5 }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
           <Tooltip 
            contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568', color: '#E2E8F0' }} 
            formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
            labelFormatter={(label: number) => `Stock Price: $${label.toFixed(2)}`}
          />
          <Legend wrapperStyle={{fontSize: "14px"}}/>
          <ReferenceLine y={0} stroke="#718096" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="actualCallPL" name="Actual Call P&L" stroke="#2DD4BF" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="syntheticCallPL" name="Synthetic Call P&L" stroke="#F97316" strokeWidth={2} strokeDasharray="8 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PayoffChart;
