"""
Carbon Footprint ML Predictor for Ecoverse
Trains model on shopping & lifestyle data to predict carbon emissions
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import pickle
import json
from datetime import datetime
import os
from pathlib import Path

# Create models directory
MODELS_DIR = Path(__file__).parent / 'models'
MODELS_DIR.mkdir(exist_ok=True)

# Generate synthetic dataset based on real carbon emission patterns
# Sources: EPA, Carbon Trust, UK Government GHG Conversion Factors
def generate_carbon_dataset(n_samples=3000):
    """
    Generate realistic carbon footprint dataset matching frontend form
    """
    np.random.seed(42)
    
    data = {
        'shopping_spend': np.random.gamma(3, 100, n_samples),
        'online_orders': np.random.randint(0, 20, n_samples),
        'fast_fashion': np.random.randint(0, 15, n_samples),
        'eco_products': np.random.uniform(0, 1, n_samples),
        'car_km': np.random.gamma(2, 200, n_samples),
        'flights_per_year': np.random.choice([0, 0, 1, 2], n_samples),
        'electricity_kwh': np.random.gamma(3, 100, n_samples),
        'diet_type': np.random.choice([0, 1, 2, 3], n_samples),
        'household_size': np.random.choice([1, 2, 3, 4, 5], n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Calculate carbon footprint (kg CO2e/month)
    carbon = np.zeros(n_samples)
    
    # Shopping emissions
    carbon += df['shopping_spend'] * 0.01
    carbon += df['online_orders'] * 3.5
    carbon += df['fast_fashion'] * 8
    carbon -= df['eco_products'] * df['shopping_spend'] * 0.003
    
    # Transport emissions
    carbon += df['car_km'] * 0.171
    carbon += df['flights_per_year'] * (250 / 12)
    
    # Electricity emissions
    carbon += df['electricity_kwh'] * 0.4
    
    # Diet emissions
    carbon += (df['diet_type'] == 0) * 250  # meat heavy
    carbon += (df['diet_type'] == 1) * 150  # balanced
    carbon += (df['diet_type'] == 2) * 80   # vegetarian
    carbon += (df['diet_type'] == 3) * 50   # vegan
    
    # Add noise and ensure minimum
    carbon += np.random.normal(0, 20, n_samples)
    carbon = np.maximum(carbon, 50)
    
    df['carbon_footprint'] = carbon
    return df


def train_carbon_predictor():
    """Train ML model to predict carbon footprint"""
    
    print("\n🌱 EcoVerse Carbon ML Training")
    print("=" * 50)
    
    print("\n📊 Generating dataset...")
    df = generate_carbon_dataset(3000)
    
    print(f"Dataset: {len(df)} samples")
    print(f"Avg carbon: {df['carbon_footprint'].mean():.2f} kg CO2e/month")
    
    # Prepare features
    X = df.drop('carbon_footprint', axis=1)
    y = df['carbon_footprint']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    print("\n🤖 Training RandomForest...")
    model = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    
    print(f"Train R²: {train_score:.4f}")
    print(f"Test R²:  {test_score:.4f}")
    
    # Save
    print(f"\n💾 Saving model to {MODELS_DIR}...")
    model_data = {
        'model': model,
        'scaler': scaler,
        'features': list(X.columns),
        'created': datetime.now().isoformat(),
        'score': float(test_score)
    }
    
    with open(MODELS_DIR / 'carbon_predictor.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    metadata = {
        'model_type': 'RandomForest',
        'test_r2_score': float(test_score),
        'features': list(X.columns),
        'created': datetime.now().isoformat(),
    }
    
    with open(MODELS_DIR / 'metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("✅ Training complete!")
    print("=" * 50)


if __name__ == "__main__":
    train_carbon_predictor()
    print(feature_importance.head(10))
    
    # Save model and preprocessors
    model_artifacts = {
        'model': best_model,
        'scaler': scaler,
        'label_encoders': le_dict,
        'feature_names': list(X.columns),
        'categorical_cols': categorical_cols,
        'numerical_cols': numerical_cols,
        'model_type': best_model_name,
        'r2_score': max(rf_score, gb_score),
        'trained_date': datetime.now().isoformat(),
        'feature_importance': feature_importance.to_dict('records')
    }
    
    with open('models/carbon_predictor.pkl', 'wb') as f:
        pickle.dump(model_artifacts, f)
    
    # Save metadata
    metadata = {
        'model_type': best_model_name,
        'r2_score': float(max(rf_score, gb_score)),
        'trained_date': datetime.now().isoformat(),
        'feature_count': len(X.columns),
        'training_samples': len(X_train),
        'avg_carbon_footprint': float(df['carbon_footprint_kg'].mean()),
        'std_carbon_footprint': float(df['carbon_footprint_kg'].std())
    }
    
    with open('models/metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("\n💾 Model saved to: models/carbon_predictor.pkl")
    print("✨ Training complete!")
    
    return model_artifacts


if __name__ == "__main__":
    train_carbon_predictor()
