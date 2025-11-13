
import React, { useState, useMemo, useCallback } from 'react';
import type { OptionInputParams } from '../types';
import { calculateBSM } from '../services/optionPricingService';
import { fetchModelExplanation } from '../services/geminiService';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import PayoffChart from './charts/PayoffChart';

const SyntheticOptionModel: React.FC = () => {
  const [params, setParams] = useState<OptionInputParams>({
    S: 100, K: 100, T: 0.25, r: 0.05, sigma: 0.2,
  });
  const [explanation, setExplanation] = useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const handleParamChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: parseFloat(value) }));
  }, []);

  const { costs, payoffData } = useMemo(() => {
    const { S, K, T, r, sigma } = params;
    
    // 1. Calculate costs
    const optionPrices = calculateBSM(params);
    const actualCallCost = optionPrices.call;
    const syntheticCallCost = S + optionPrices.put;
    const costs = { actualCallCost, syntheticCallCost, putCost: optionPrices.put };

    // 2. Generate payoff data
    const data = [];
    const lowerBound = S * 0.7;
    const upperBound = S * 1.3;
    for (let i = 0; i <= 100; i++) {
        const finalStockPrice = lowerBound + (upperBound - lowerBound) * (i / 100);
        const actualCallPL = Math.max(0, finalStockPrice - K) - actualCallCost;
        const syntheticCallPL = (finalStockPrice - S) + Math.max(0, K - finalStockPrice) - costs.putCost;
        data.push({ stockPrice: finalStockPrice, actualCallPL, syntheticCallPL });
    }

    return { costs, payoffData: data };
  }, [params]);

  const handleGetExplanation = async () => {
    setIsLoadingExplanation(true);
    setExplanation('');
    const fetchedExplanation = await fetchModelExplanation('Synthetic');
    setExplanation(fetchedExplanation);
    setIsLoadingExplanation(false);
  };

  return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card title="Strategy Inputs">
                <div className="space-y-4">
                    <Input label="Stock Price (S)" name="S" type="number" value={params.S} onChange={handleParamChange} step={1}/>
                    <Input label="Strike Price (K)" name="K" type="number" value={params.K} onChange={handleParamChange} step={1}/>
                    <Input label="Time to Expiry (T, years)" name="T" type="number" value={params.T} onChange={handleParamChange} step={0.1} min={0}/>
                    <Input label="Risk-Free Rate (r)" name="r" type="number" value={params.r} onChange={handleParamChange} step={0.01}/>
                    <Input label="Volatility (σ)" name="sigma" type="number" value={params.sigma} onChange={handleParamChange} step={0.01} min={0}/>
                </div>
            </Card>
            
            <Card title="Strategy Cost Comparison" className="md:col-span-2">
                <p className="text-sm text-gray-400 mb-6">Based on Put-Call Parity, the cost to establish both positions should be nearly identical, ignoring transaction fees and market frictions.</p>
                <div className="flex justify-around items-center h-full">
                    <div className="text-center">
                        <h3 className="text-lg text-gray-300 mb-2">Actual Call Cost</h3>
                        <p className="text-4xl font-bold text-cyan-400">${costs.actualCallCost.toFixed(4)}</p>
                    </div>
                     <div className="text-center">
                        <h3 className="text-lg text-gray-300 mb-2">Synthetic Call Cost</h3>
                        <p className="text-4xl font-bold text-orange-400">${costs.syntheticCallCost.toFixed(4)}</p>
                        <p className="text-xs text-gray-500 mt-1">(Stock Price + Put Premium)</p>
                    </div>
                </div>
            </Card>
        </div>

        <Card title="Payoff Comparison at Expiry">
            <PayoffChart data={payoffData} />
        </Card>

        <Card title="About Synthetic Options">
            <div className="space-y-4">
            <Button onClick={handleGetExplanation} disabled={isLoadingExplanation}>
                {isLoadingExplanation ? 'Loading Explanation...' : 'Explain Synthetic Calls with AI'}
            </Button>
            {explanation && (
                <div className="prose prose-invert prose-sm max-w-none mt-4 text-gray-300" dangerouslySetInnerHTML={{__html: explanation.replace(/\n/g, '<br />')}} />
            )}
            </div>
        </Card>
    </div>
  );
};

export default SyntheticOptionModel;
