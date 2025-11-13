import React, { useState, useCallback } from 'react';
import { runStrategyBacktest } from '../services/optionPricingService';
import type { StrategyResult } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import CumulativeReturnChart from './charts/CumulativeReturnChart';

const StrategyBacktest: React.FC = () => {
    const [results, setResults] = useState<StrategyResult[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRunBacktest = useCallback(() => {
        setIsLoading(true);
        // Simulate API call latency
        setTimeout(() => {
            const backtestResults = runStrategyBacktest();
            setResults(backtestResults);
            setIsLoading(false);
        }, 500);
    }, []);

    const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

    return (
        <div className="space-y-8">
            <Card title="Backtest Setup & Controls">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="text-gray-600">
                        <p><strong>Strategies:</strong> Covered Call, Protective Put, Long Straddle</p>
                        <p><strong>Horizon:</strong> 2 Years (Simulated Monthly Rebalancing)</p>
                        <p><strong>Initial Investment:</strong> $100,000 per strategy</p>
                    </div>
                    <Button onClick={handleRunBacktest} disabled={isLoading}>
                        {isLoading ? 'Running Simulation...' : 'Run Backtest'}
                    </Button>
                </div>
            </Card>

            {results && (
                <>
                    <Card title="Cumulative Returns (2 Years)">
                        <CumulativeReturnChart data={results} />
                    </Card>
                    <Card title="Performance Metrics">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                                        {results.map(res => (
                                            <th key={res.name} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{res.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Object.keys(results[0].metrics).map((key) => (
                                        <tr key={key}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                                            {results.map(res => (
                                                <td key={res.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {formatPercent((res.metrics as any)[key])}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};

export default StrategyBacktest;
