import numpy as np
from pydantic import BaseModel
from typing import List, Dict

class MonteCarloRequest(BaseModel):
    base_arr: float
    base_growth_rate: float
    growth_volatility: float  # std dev of growth rate
    base_churn_rate: float
    churn_volatility: float   # std dev of churn rate
    months: int = 36          # 3 years by default
    simulations: int = 10000

class MonteCarloResult(BaseModel):
    percentile_10: List[float] # worst case trajectory
    percentile_50: List[float] # median case trajectory
    percentile_90: List[float] # best case trajectory
    months: List[int]
    bankruptcy_probability: float # % of sims hitting <= 0 ARR

class MonteCarloService:
    @staticmethod
    def run_simulations(data: MonteCarloRequest) -> MonteCarloResult:
        # We will simulate monthly ARR growth
        monthly_growth_mean = data.base_growth_rate / 12
        monthly_growth_std = data.growth_volatility / 12
        
        monthly_churn_mean = data.base_churn_rate / 12
        monthly_churn_std = data.churn_volatility / 12
        
        # Shape: (simulations, months)
        # Generate random samples from normal distribution
        np.random.seed(42) # for reproducibility in this example
        
        growth_samples = np.random.normal(
            loc=monthly_growth_mean, 
            scale=monthly_growth_std, 
            size=(data.simulations, data.months)
        )
        
        churn_samples = np.random.normal(
            loc=monthly_churn_mean,
            scale=monthly_churn_std,
            size=(data.simulations, data.months)
        )
        
        # Ensure churn isn't negative
        churn_samples = np.clip(churn_samples, a_min=0, a_max=None)
        
        # Net growth per month
        net_growth = growth_samples - churn_samples
        
        # Calculate ARR trajectories
        # arr_t = arr_{t-1} * (1 + net_growth_t)
        # We can compute cumulative products
        
        # Add 1 to net growth for multiplication
        multipliers = 1 + net_growth
        
        # Cumulative product along the months axis
        cum_multipliers = np.cumprod(multipliers, axis=1)
        
        # Multiply by initial ARR
        arr_trajectories = data.base_arr * cum_multipliers
        
        # Calculate percentiles for each month
        p10 = np.percentile(arr_trajectories, 10, axis=0)
        p50 = np.percentile(arr_trajectories, 50, axis=0)
        p90 = np.percentile(arr_trajectories, 90, axis=0)
        
        # Bankruptcy probability (hitting <= 0)
        # Check if the final month ARR is effectively zero (or negative, though cumprod prevents negative if multiplier > 0)
        # If multiplier drops below 0 (meaning net_growth < -100%), ARR goes negative
        bankruptcies = np.sum(arr_trajectories[:, -1] <= 0)
        bankruptcy_prob = (bankruptcies / data.simulations) * 100
        
        return MonteCarloResult(
            percentile_10=p10.tolist(),
            percentile_50=p50.tolist(),
            percentile_90=p90.tolist(),
            months=list(range(1, data.months + 1)),
            bankruptcy_probability=bankruptcy_prob
        )
