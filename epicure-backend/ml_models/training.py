import pandas as pd
import joblib
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, root_mean_squared_error
from sklearn.preprocessing import LabelEncoder
import os

print("Starting training pipeline...")

# Adjust path assuming this script is run from epicure-backend
data_path = os.path.join(os.path.dirname(__file__), "..", "..", "transactional_data.csv")
if not os.path.exists(data_path):
    raise FileNotFoundError(f"Dataset not found at {data_path}")

df = pd.read_csv(data_path)

# Ensure Date is parsed
df['Date'] = pd.to_datetime(df['Date'], dayfirst=True)

# Define target and features
target = 'Final_Revenue'
# We select a few simple numerical/categorical features for the prototype
features = ['Quantity', 'Price', 'Discount_%', 'Number_of_Staff', 'Weather_Condition', 'Local_Event']

# Data preprocessing
df = df.dropna(subset=[target] + features)

# Encode categorical variables
le_weather = LabelEncoder()
df['Weather_Condition'] = le_weather.fit_transform(df['Weather_Condition'].astype(str))

le_event = LabelEncoder()
df['Local_Event'] = le_event.fit_transform(df['Local_Event'].astype(str))

X = df[features]
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train XGBoost model
model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
print("Training XGBoost Regressor...")
model.fit(X_train, y_train)

# Evaluate
preds = model.predict(X_test)
mae = mean_absolute_error(y_test, preds)
rmse = root_mean_squared_error(y_test, preds)

print(f"Model trained successfully!")
print(f"Validation MAE: {mae:.2f}")
print(f"Validation RMSE: {rmse:.2f}")

# Save the model and encoders
models_dir = os.path.dirname(__file__)
joblib.dump(model, os.path.join(models_dir, 'xgboost_revenue_model.joblib'))
joblib.dump(le_weather, os.path.join(models_dir, 'le_weather.joblib'))
joblib.dump(le_event, os.path.join(models_dir, 'le_event.joblib'))

print("Models saved successfully in ml_models directory.")
