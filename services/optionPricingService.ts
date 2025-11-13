
import type { OptionInputParams, OptionResult, ChartDataPoint } from '../types';

// Standard Normal Cumulative Distribution Function (CDF) using Abramowitz and Stegun approximation
const normalCDF = (x: number): number => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
};

export const calculateBSM = (params: OptionInputParams): OptionResult => {
  const { S, K, T, r, sigma } = params;
  if (T <= 0 || sigma <= 0) {
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
  const dt = T / steps;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const p = (Math.exp(r * dt) - d) / (u - d);

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
