import React, { useState, useMemo, useCallback } from 'react';
import type { OptionInputParams, OptionResult } from '../types';
import { calculateBinomial, calculateBSM } from '../services/optionPricingService';
import Card from './common/Card';
import Input from './common/Input';

const BinomialModel: React.FC = () => {
  const [params, setParams] = useState<OptionInputParams>({
    S: 100, K: 100, T: 1, r: 0.05, sigma: 0.2, steps: 50,
  });

  const handleParamChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: parseFloat(value) }));
  }, []);

  const { binomialResult, bsmResult } = useMemo(() => {
    const binomialResult: OptionResult = calculateBinomial(params);
    const bsmResult: OptionResult = calculateBSM(params);
    return { binomialResult, bsmResult };
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
            <Input label="Number of Steps" name="steps" type="number" value={params.steps} onChange={handleParamChange} step={10} min={10}/>
          </div>
        </Card>
        
        <Card title="Calculated Premiums & Comparison" className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-orange-600 text-center">Binomial Model</h3>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-lg text-gray-600 mb-1">Call Premium</h4>
                        <p className="text-3xl font-bold text-green-600">${binomialResult.call.toFixed(4)}</p>
                    </div>
                     <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-lg text-gray-600 mb-1">Put Premium</h4>
                        <p className="text-3xl font-bold text-red-600">${binomialResult.put.toFixed(4)}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700 text-center">BSM for Comparison</h3>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-lg text-gray-600 mb-1">Call Premium</h4>
                        <p className="text-3xl font-bold text-green-500">${bsmResult.call.toFixed(4)}</p>
                    </div>
                     <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-lg text-gray-600 mb-1">Put Premium</h4>
                        <p className="text-3xl font-bold text-red-500">${bsmResult.put.toFixed(4)}</p>
                    </div>
                </div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-6">Note: As the number of steps increases, the Binomial model price converges to the BSM model price.</p>
        </Card>
      </div>
    </div>
  );
};

export default BinomialModel;