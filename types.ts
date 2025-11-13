
export interface OptionInputParams {
  S: number; // Stock Price
  K: number; // Strike Price
  T: number; // Time to Expiry (in years)
  r: number; // Risk-Free Rate (annual)
  sigma: number; // Volatility (annual)
  steps?: number; // Number of steps for Binomial model
}

export interface OptionResult {
  call: number;
  put: number;
}

export interface ChartDataPoint {
  x: number;
  y_call: number;
  y_put: number;
}

export interface PayoffDataPoint {
  stockPrice: number;
  actualCallPL: number;
  syntheticCallPL: number;
}

export interface MonthlyReturn {
  month: string;
  coveredCall: number;
  protectivePut: number;
  longStraddle: number;
}

export interface StrategyMetrics {
  totalReturn: number;
  winRate: number;
  maxDrawdown: number;
  bestMonth: number;
  worstMonth: number;
  annualizedVolatility: number;
}

export interface StrategyResult {
  name: string;
  metrics: StrategyMetrics;
  cumulativeReturns: { month: number; value: number }[];
}