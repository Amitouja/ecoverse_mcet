"""
ML-based Carbon Footprint Prediction Service
Loads trained model and makes predictions
"""

import pickle
import json
import numpy as np
import sys
from pathlib import Path

# Setup paths
SCRIPT_DIR = Path(__file__).parent
MODEL_PATH = SCRIPT_DIR / 'models' / 'carbon_predictor.pkl'

def load_model():
    """Load trained model artifacts"""
    if not MODEL_PATH.exists():
        print(f"❌ Model not found at {MODEL_PATH}", file=sys.stderr)
        return None
    
    try:
        with open(MODEL_PATH, 'rb') as f:
            return pickle.load(f)
    except Exception as e:
        print(f"❌ Error loading model: {e}", file=sys.stderr)
        return None


def predict_carbon_footprint(user_data, model_artifacts):
    """
    Predict carbon footprint based on user lifestyle data
    """
    if model_artifacts is None:
        return {'success': False, 'error': 'Model not loaded'}
    
    model = model_artifacts['model']
    scaler = model_artifacts['scaler']
    features = model_artifacts['features']
    
    # Prepare feature vector in correct order
    feature_vector = []
    for feature in features:
        value = user_data.get(feature, 0)
        feature_vector.append(float(value))
    
    X = np.array([feature_vector])
    X_scaled = scaler.transform(X)
    
    # Make prediction
    carbon_prediction = float(model.predict(X_scaled)[0])
    carbon_prediction = max(carbon_prediction, 50)
    
    # Calculate breakdown (estimate based on feature contributions)
    breakdown = calculate_breakdown(user_data)
    
    # Generate recommendations
    recommendations = generate_recommendations(carbon_prediction, user_data, breakdown)
    
    # Determine priority
    if carbon_prediction > 40:
        priority = 'high'
    elif carbon_prediction > 20:
        priority = 'medium'
    else:
        priority = 'low'
    
    return {
        'success': True,
        'data': {
            'totalCarbonFootprint': round(carbon_prediction, 2),
            'breakdown': breakdown,
            'equivalentTrees': int(np.ceil(carbon_prediction / 20)),
            'priority': priority,
            'recommendations': recommendations
        }
    }


def calculate_breakdown(user_data):
    """Calculate carbon breakdown by category"""
    shopping = (user_data.get('shopping_spend', 0) * 0.01 + 
                user_data.get('online_orders', 0) * 3.5 + 
                user_data.get('fast_fashion', 0) * 8)
    
    transport = (user_data.get('car_km', 0) * 0.171 + 
                 user_data.get('flights_per_year', 0) * (250/12))
    
    electricity = user_data.get('electricity_kwh', 0) * 0.4
    
    diet = {0: 250, 1: 150, 2: 80, 3: 50}.get(user_data.get('diet_type', 1), 150)
    
    return {
        'shopping': round(max(shopping, 0), 2),
        'transport': round(max(transport, 0), 2),
        'electricity': round(max(electricity, 0), 2),
        'diet': round(max(diet, 0), 2),
        'waste': round(max(5, 0), 2)
    }


def generate_recommendations(total_carbon, user_data, breakdown):
    """Generate personalized recommendations"""
    recommendations = []
    
    # Shopping recommendations
    if breakdown['shopping'] > 10:
        recommendations.append("🛍️ Buy from sustainable brands and reduce fast fashion purchases")
    
    # Transport recommendations
    if breakdown['transport'] > 15:
        recommendations.append("🚗 Consider carpooling or using public transportation more often")
    if user_data.get('flights_per_year', 0) > 0:
        recommendations.append("✈️ Reduce air travel or offset flight emissions")
    
    # Electricity recommendations
    if breakdown['electricity'] > 15:
        recommendations.append("⚡ Switch to renewable energy or upgrade to energy-efficient appliances")
    
    # Diet recommendations
    if breakdown['diet'] > 100:
        recommendations.append("🥗 Try Meatless Mondays or consider a more plant-based diet")
    
    # Eco products
    if user_data.get('eco_products', 0) < 0.5:
        recommendations.append("🌿 Increase purchase of eco-certified and sustainable products")
    
    # General
    recommendations.append("♻️ Track your carbon footprint regularly and set reduction goals")
    recommendations.append("🌳 Offset remaining emissions by supporting renewable projects")
    
    return recommendations[:8]  # Return max 8 recommendations


def main():
    """Main prediction function"""
    if len(sys.argv) < 2:
        print("Usage: python predict.py '<json_data>'")
        sys.exit(1)
    
    try:
        user_data = json.loads(sys.argv[1])
    except json.JSONDecodeError:
        print("❌ Invalid JSON input", file=sys.stderr)
        sys.exit(1)
    
    # Load model
    artifacts = load_model()
    
    # Make prediction
    result = predict_carbon_footprint(user_data, artifacts)
    
    # Output result
    print(json.dumps(result))


if __name__ == "__main__":
    main()
