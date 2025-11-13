import React, { useState, useMemo, useCallback } from 'react';
import type { OptionInputParams, OptionResult } from '../types';
import { calculateBSM, generateGreeksData } from '../services/optionPricingService';
import Card from './common/Card';
import Input from './common/Input';
import GreeksChart from './charts/GreeksChart';

const BSMModel: React.FC = () => {
  const [params, setParams] = useState<OptionInputParams>({
    S: 100, K: 100, T: 1, r: 0.05, sigma: 0.2,
  });

  const handleParamChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: parseFloat(value) }));
  }, []);

  const { result, greeksData } = useMemo(() => {
    const result: OptionResult = calculateBSM(params);
    const greeksData = generateGreeksData(params);
    return { result, greeksData };
  }, [params]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card title="Model Inputs">
          <div className="space-y-4">
            <Input label="Stock Price (S)" name="S" type="number" value={params.S} onChange={handleParamChange} step={1}/>
            <Input label="Strike Price (K)" name="K" type="number" value={params.K} onChange={handleParamChange} step={1}/>
            <Input label="Time to Expiry (T, years)" name="T" type="number" value={params.T} onChange={handleParamChange} step={0.1} min={0}/>
            <Input label="Risk-Free Rate (r)" name="r" type="number" value={params.r} onChange={handleParamChange} step={0.01}/>
            <Input label="Volatility (σ)" name="sigma" type="number" value={params.sigma} onChange={handleParamChange} step={0.01} min={0}/>
          </div>
        </Card>
        
        <Card title="Calculated Premiums" className="md:col-span-2">
           <div className="flex justify-around items-center h-full">
                <div className="text-center">
                    <h3 className="text-lg text-gray-600 mb-2">Call Premium</h3>
                    <p className="text-4xl font-bold text-green-600">${result.call.toFixed(4)}</p>
                </div>
                <div className="text-center">
                    <h3 className="text-lg text-gray-600 mb-2">Put Premium</h3>
                    <p className="text-4xl font-bold text-red-600">${result.put.toFixed(4)}</p>
                </div>
            </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card title="Delta vs. Stock Price">
              <GreeksChart data={greeksData.deltaData} xAxisKey="x" yAxisKeyCall="y_call" yAxisKeyPut="y_put" yAxisDomain={[-1,1]} xAxisLabel="Stock Price (S)" callLabel="Call Delta" putLabel="Put Delta" />
          </Card>
           <Card title="Vega vs. Volatility">
              <GreeksChart data={greeksData.vegaData} xAxisKey="x" yAxisKeyCall="y_call" yAxisKeyPut="y_put" xAxisLabel="Volatility (σ)" callLabel="Vega" showPut={false} />
          </Card>
      </div>
    </div>
  );
};

export default BSMModel;