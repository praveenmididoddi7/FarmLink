export interface PricePredictionRequest {
  crop: string;
  category?: string;
  variety?: string;
  quality_grade?: string;
  location?: string;
  state?: string;
  season?: string;
  quantity?: number;
  quantity_kg?: number;
  moisture_percent?: number;
  rainfall_index?: string;
  historical_base_price?: number;
  soil_type?: string;
  festival_proximity?: string;
  rainfall_condition?: string;
}

export interface PricePredictionResponse {
  crop: string;
  location?: string;
  current_market_price?: number;
  current_mandi_modal?: number;
  predicted_price: number;
  confidence?: number;
  confidence_score?: number;
  price_change_percent?: number;
  price_trajectory_percent?: number;
  trend?: 'increasing' | 'decreasing' | 'stable';
  recommendation?: string;
  harvest_timing_advice?: string;
  ai_explanation?: string;
  recommended_min_price?: number;
  recommended_max_price?: number;
  best_selling_window?: string;
  risk_factor?: string;
  factors?: {
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: string;
  }[];
  projected_timeline?: {
    day: string;
    predicted: number;
    lower_bound: number;
    upper_bound: number;
  }[];
  seven_day_forecast?: {
    day: string;
    predicted_price: number;
  }[];
}

export interface DemandForecastData {
  crop: string;
  current_demand_index: number;
  predicted_demand_index: number;
  demand_trend: 'Surging' | 'High' | 'Moderate' | 'Low';
  recommended_harvest_qty_quintals: number;
  regional_hotspots: string[];
  historical_forecast_chart: {
    period: string;
    actual_demand: number;
    predicted_demand: number;
    supply_volume: number;
  }[];
}

export interface AIRecommendation {
  id: string;
  type: 'price_surge' | 'demand_alert' | 'timing_advice' | 'logistics_tip' | 'weather_impact';
  title: string;
  description: string;
  action_label?: string;
  action_url?: string;
  priority: 'high' | 'medium' | 'info';
  timestamp: string;
}
