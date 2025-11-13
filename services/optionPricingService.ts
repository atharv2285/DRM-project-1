
import type { OptionInputParams, OptionResult, ChartDataPoint, StrategyResult, StrategyMetrics } from '../types';

// Standard Normal Cumulative Distribution Function (CDF) using Abramowitz and Stegun approximation
const normalCDF = (x: number): number => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
};

export const calculateBSM = (params: OptionInputParams): OptionResult => {
  const { S, K, T, r, sigma } = params;
  if (T <= 0 || sigma <= 0 || S <= 0) {
    return { call: S > K ? S - K : 0, put: K > S ? K - S : 0 };
  }

  const d1 = (Math.log(S / K) + (r + (sigma ** 2) / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  const call = S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
  const put = K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);

  return { call, put };
};

export const generateGreeksData = (params: OptionInputParams): { deltaData: ChartDataPoint[], vegaData: ChartDataPoint[] } => {
    const { S, K, T, r, sigma } = params;
    const deltaData: ChartDataPoint[] = [];
    const vegaData: ChartDataPoint[] = [];

    // Delta vs. Stock Price
    for (let i = 0; i <= 100; i++) {
        const currentS = S * 0.5 + S * (i / 100);
        if (T > 0 && sigma > 0) {
            const d1 = (Math.log(currentS / K) + (r + sigma ** 2 / 2) * T) / (sigma * Math.sqrt(T));
            const callDelta = normalCDF(d1);
            const putDelta = callDelta - 1;
            deltaData.push({ x: currentS, y_call: callDelta, y_put: putDelta });
        }
    }

    // Vega vs. Volatility
    for (let i = 1; i <= 100; i++) {
        const currentSigma = sigma * 0.1 + sigma * 1.9 * (i / 100);
        if (T > 0 && currentSigma > 0) {
           const d1 = (Math.log(S / K) + (r + currentSigma ** 2 / 2) * T) / (currentSigma * Math.sqrt(T));
           const vega = S * Math.sqrt(T) * (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(d1**2)/2);
           vegaData.push({ x: currentSigma, y_call: vega/100, y_put: vega/100 });
        }
    }

    return { deltaData, vegaData };
};


export const calculateBinomial = (params: OptionInputParams): OptionResult => {
  const { S, K, T, r, sigma, steps = 50 } = params;
  if (T <= 0 || sigma <= 0 || S <= 0) {
    return { call: S > K ? S - K : 0, put: K > S ? K - S : 0 };
  }
  const dt = T / steps;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const p = (Math.exp(r * dt) - d) / (u - d);

  if (p < 0 || p > 1) { // Arbitrage check
    return {call: 0, put: 0};
  }

  const prices: number[][] = new Array(steps + 1).fill(0).map(() => new Array(steps + 1).fill(0));

  for (let j = 0; j <= steps; j++) {
    for (let i = 0; i <= j; i++) {
      prices[i][j] = S * (u ** (j - i)) * (d ** i);
    }
  }

  const callValues: number[][] = new Array(steps + 1).fill(0).map(() => new Array(steps + 1).fill(0));
  const putValues: number[][] = new Array(steps + 1).fill(0).map(() => new Array(steps + 1).fill(0));

  for (let i = 0; i <= steps; i++) {
    callValues[i][steps] = Math.max(0, prices[i][steps] - K);
    putValues[i][steps] = Math.max(0, K - prices[i][steps]);
  }

  for (let j = steps - 1; j >= 0; j--) {
    for (let i = 0; i <= j; i++) {
      callValues[i][j] = Math.exp(-r * dt) * (p * callValues[i][j + 1] + (1 - p) * callValues[i + 1][j + 1]);
      putValues[i][j] = Math.exp(-r * dt) * (p * putValues[i][j + 1] + (1 - p) * putValues[i + 1][j + 1]);
    }
  }

  return { call: callValues[0][0], put: putValues[0][0] };
};

// --- Strategy Backtesting Service ---

const generateMockPriceData = (startPrice: number, years: number, annualDrift: number, annualVol: number): number[] => {
    const days = years * 252;
    const prices = [startPrice];
    const dt = 1 / 252;
    
    for (let i = 1; i < days; i++) {
        const shock = annualVol * Math.sqrt(dt) * (Math.random() - 0.5) * 2 * Math.sqrt(3); // Uniform for simplicity
        const drift = annualDrift * dt;
        const nextPrice = prices[i-1] * Math.exp(drift + shock);
        prices.push(nextPrice);
    }
    return prices;
};

const calculateMetrics = (monthlyReturns: number[]): StrategyMetrics => {
    const totalReturn = monthlyReturns.reduce((acc, r) => acc * (1 + r), 1) - 1;
    const winRate = monthlyReturns.filter(r => r > 0).length / monthlyReturns.length;
    const bestMonth = Math.max(...monthlyReturns);
    const worstMonth = Math.min(...monthlyReturns);

    let peak = 1;
    let maxDrawdown = 0;
    monthlyReturns.forEach(r => {
        const currentValue = peak * (1 + r);
        peak = Math.max(peak, currentValue);
        const drawdown = (peak - currentValue) / peak;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
    });
    
    const meanReturn = monthlyReturns.reduce((a, b) => a + b, 0) / monthlyReturns.length;
    const variance = monthlyReturns.reduce((a, b) => a + (b - meanReturn) ** 2, 0) / monthlyReturns.length;
    const annualizedVolatility = Math.sqrt(variance) * Math.sqrt(12);

    return { totalReturn, winRate, maxDrawdown, bestMonth, worstMonth, annualizedVolatility };
};


export const runStrategyBacktest = (): StrategyResult[] => {
    const initialInvestment = 100_000;
    const S0 = 100;
    const r = 0.05;
    const sigma = 0.25;
    const years = 2;
    const daysPerMonth = 21;

    const prices = generateMockPriceData(S0, years, 0.10, sigma);

    const strategies = ['Covered Call', 'Protective Put', 'Long Straddle'];
    const results: StrategyResult[] = [];

    strategies.forEach(name => {
        let portfolioValue = initialInvestment;
        const cumulativeReturns = [{ month: 0, value: initialInvestment }];
        const monthlyReturns: number[] = [];

        for (let i = 0; i < years * 12; i++) {
            const startDay = i * daysPerMonth;
            const endDay = (i + 1) * daysPerMonth;
            const S_start = prices[startDay];
            const S_end = prices[endDay-1];
            
            const T = 1/12;

            let monthlyReturn = 0;

            if (name === 'Covered Call') {
                const K = S_start * 1.05; // 5% OTM Call
                const numShares = portfolioValue / S_start;
                const callPremium = calculateBSM({ S: S_start, K, T, r, sigma }).call;
                const pnl = (numShares * S_end + numShares * callPremium) - (numShares * S_start) - numShares * Math.max(0, S_end - K);
                monthlyReturn = pnl / portfolioValue;
            } else if (name === 'Protective Put') {
                const K = S_start; // ATM Put
                const putPremium = calculateBSM({ S: S_start, K, T, r, sigma }).put;
                const costPerShare = S_start + putPremium;
                const numUnits = portfolioValue / costPerShare;
                const pnl = numUnits * (S_end + Math.max(0, K - S_end)) - portfolioValue;
                monthlyReturn = pnl / portfolioValue;
            } else if (name === 'Long Straddle') {
                const K = S_start; // ATM Call & Put
                const {call, put} = calculateBSM({ S: S_start, K, T, r, sigma });
                const cost = call + put;
                const numStraddles = portfolioValue / cost;
                const pnl = numStraddles * (Math.max(0, S_end - K) + Math.max(0, K - S_end)) - portfolioValue;
                monthlyReturn = pnl / portfolioValue;
            }
            
            portfolioValue *= (1 + monthlyReturn);
            monthlyReturns.push(monthlyReturn);
            cumulativeReturns.push({ month: i + 1, value: portfolioValue });
        }
        
        results.push({
            name,
            metrics: calculateMetrics(monthlyReturns),
            cumulativeReturns,
        });
    });

    return results;
};