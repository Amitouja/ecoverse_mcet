"""
ML-based Carbon Footprint Prediction Service
Loads trained model and makes predictions based on user data
"""

import pickle
import json
import numpy as np
import sys
import os

def load_model():
    """Load trained model artifacts"""
    model_path = 'models/carbon_predictor.pkl'
    
    if not os.path.exists(model_path):
        return None
    
    try:
        with open(model_path, 'rb') as f:
            model_artifacts = pickle.load(f)
        return model_artifacts
    except FileNotFoundError:
        return None


def predict_carbon_footprint(user_data, model_artifacts):
    """
    Predict carbon footprint for a user based on their lifestyle data
    
    Args:
        user_data: dict with features for prediction
        model_artifacts: dict containing trained model and preprocessing objects
    
    Returns:
        dict with prediction and recommendations
    """
    
    if model_artifacts is None:
        return None
    
    model = model_artifacts['model']
    scaler = model_artifacts['scaler']
    label_encoders = model_artifacts['label_encoders']
    feature_names = model_artifacts['feature_names']
    categorical_cols = model_artifacts['categorical_cols']
    
    # Prepare feature vector
    features_list = []
    
    for feature_name in feature_names:
        if feature_name in categorical_cols:
            # Encode categorical variable
            le = label_encoders[feature_name]
            value = user_data.get(feature_name, None)
            
            if value is None:
                # Use default value
                value = le.classes_[0]
            
            try:
                encoded_value = le.transform([value])[0]
            except ValueError:
                encoded_value = le.transform([le.classes_[0]])[0]
            
            features_list.append(encoded_value)
        else:
            # Numerical features
            value = user_data.get(feature_name, 0.0)
            features_list.append(float(value))
    
    # Convert to numpy array and scale
    X = np.array([features_list])
    X_scaled = scaler.transform(X)
    
    # Make prediction
    predicted_carbon = model.predict(X_scaled)[0]
    predicted_carbon = max(predicted_carbon, 50)  # Minimum 50 kg CO2e/month
    
    # Determine priority level
    if predicted_carbon > 400:
        priority = "critical"
        priority_emoji = "🔴"
    elif predicted_carbon > 250:
        priority = "high"
        priority_emoji = "🟠"
    elif predicted_carbon > 150:
        priority = "medium"
        priority_emoji = "🟡"
    else:
        priority = "low"
        priority_emoji = "🟢"
    
    # Generate recommendations based on top contributors
    recommendations = generate_recommendations(user_data, priority)
    
    # Calculate equivalent trees needed to offset
    equivalent_trees = np.ceil(predicted_carbon / 20)  # 20kg CO2 per tree per year
    
    # Calculate percentage difference from average
    avg_carbon = 200
    percentage_above_avg = ((predicted_carbon - avg_carbon) / avg_carbon) * 100
    
    return {
        'carbonFootprint': round(predicted_carbon, 2),
        'equivalentTrees': int(equivalent_trees),
        'priority': priority,
        'priorityLevel': priority_emoji,
        'breakdown': {
            'shopping': round(user_data.get('monthly_shopping_spend', 100) * 0.01 + user_data.get('online_shopping_freq', 5) * 3.5, 2),
            'transport': round(user_data.get('car_km_monthly', 200) * 0.171 + user_data.get('flights_per_year', 0) * 250 / 12, 2),
            'electricity': round(user_data.get('electricity_kwh', 200) * 0.4, 2),
            'diet': round(user_data.get('diet_emission', 150), 2),
            'waste': round(user_data.get('food_waste_kg', 10) * 4.3 * 4, 2)
        },
        'recommendations': recommendations,
        'percentageAboveAverage': round(percentage_above_avg, 1),
        'targetEmissions': 150,
        'monthsSaved': calculate_months_to_target(predicted_carbon)
    }


def generate_recommendations(user_data, priority):
    """Generate personalized recommendations based on user data and priority"""
    
    recommendations = []
    
    # Shopping recommendations
    if user_data.get('monthly_shopping_spend', 0) > 300:
        recommendations.append("💰 Reduce shopping frequency - limit to essential purchases only")
    
    if user_data.get('fast_fashion_items', 0) > 5:
        recommendations.append("👕 Switch to eco-friendly brands and secondhand clothing")
    
    if user_data.get('online_shopping_freq', 0) > 10:
        recommendations.append("🚚 Buy local instead of online to reduce delivery emissions")
    
    if user_data.get('eco_products_ratio', 0) < 0.3:
        recommendations.append("🌿 Choose products with eco-certifications and sustainable materials")
    
    # Transport recommendations
    if user_data.get('car_km_monthly', 0) > 300:
        recommendations.append("🚗 Use public transport or carpool to reduce car usage")
    
    if user_data.get('flights_per_year', 0) > 2:
        recommendations.append("✈️ Reduce air travel - consider virtual meetings or road trips")
    
    if user_data.get('bike_walk_trips', 0) < 20:
        recommendations.append("🚴 Walk or bike for short distances (under 5km)")
    
    # Energy recommendations
    if user_data.get('electricity_kwh', 0) > 300:
        recommendations.append("⚡ Switch to renewable energy or improve home insulation")
    
    if user_data.get('heating_type') == 'gas':
        recommendations.append("🔥 Consider switching to electric heating with renewable energy")
    
    if user_data.get('renewable_energy', 0) == 0:
        recommendations.append("☀️ Install solar panels or subscribe to renewable energy program")
    
    # Diet recommendations
    if user_data.get('diet_type') == 'meat_heavy':
        recommendations.append("🥗 Reduce meat consumption - try Meatless Mondays")
    
    # Waste recommendations
    if user_data.get('recycling_rate', 0) < 0.5:
        recommendations.append("♻️ Improve recycling habits - check local programs")
    
    if user_data.get('food_waste_kg', 0) > 5:
        recommendations.append("🗑️ Plan meals better to reduce food waste")
    
    if user_data.get('plastic_usage') == 'high':
        recommendations.append("🛍️ Use reusable bags, bottles, and containers")
    
    # Ensure we have at least 5 recommendations, at most 8
    if len(recommendations) == 0:
        recommendations = [
            "🌱 Great start! Continue your sustainable practices",
            "📊 Monitor your carbon footprint monthly",
            "🎯 Set a goal to reduce emissions by 10% next month",
            "🌍 Share your eco-journey with friends",
            "💚 Support carbon offset projects"
        ]
    
    return recommendations[:8]


def calculate_months_to_target(current_carbon, target=150):
    """Calculate months needed to reach target"""
    
    if current_carbon <= target:
        return 0
    
    months = 0
    current = float(current_carbon)
    
    while current > target and months < 60:
        current = current * 0.9
        months += 1
    
    return months


if __name__ == '__main__':
    try:
        # Read user data from stdin
        input_data = sys.stdin.read()
        user_data = json.loads(input_data)
        
        # Load model
        model_artifacts = load_model()
        
        if model_artifacts is None:
            print(json.dumps({
                'success': False,
                'error': 'Model not found. Run train.py first.'
            }))
            sys.exit(1)
        
        # Make prediction
        result = predict_carbon_footprint(user_data, model_artifacts)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)
