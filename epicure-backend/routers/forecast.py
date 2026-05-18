from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import os
import pandas as pd

router = APIRouter(prefix="/api/forecast", tags=["Forecast"])

# Load models safely
current_dir = os.path.dirname(__file__)
model_path = os.path.join(current_dir, "..", "ml_models", "xgboost_revenue_model.joblib")
le_weather_path = os.path.join(current_dir, "..", "ml_models", "le_weather.joblib")
le_event_path = os.path.join(current_dir, "..", "ml_models", "le_event.joblib")

model, le_weather, le_event = None, None, None

try:
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        le_weather = joblib.load(le_weather_path)
        le_event = joblib.load(le_event_path)
except Exception as e:
    print("Warning: ML models failed to load. Ensure training.py is run first. Error:", e)

class PredictionRequest(BaseModel):
    Quantity: float
    Price: float
    Discount_percent: float
    Number_of_Staff: int
    Weather_Condition: str
    Local_Event: str

@router.post("/predict_revenue")
def predict_revenue(req: PredictionRequest):
    if not model:
        raise HTTPException(status_code=500, detail="Model is not loaded or trained yet.")
    
    try:
        # Encode categoricals using the trained encoders, handling unseen labels manually if needed
        weather_code = le_weather.transform([req.Weather_Condition])[0] if req.Weather_Condition in le_weather.classes_ else -1
        event_code = le_event.transform([req.Local_Event])[0] if req.Local_Event in le_event.classes_ else -1

        input_data = pd.DataFrame([{
            'Quantity': req.Quantity,
            'Price': req.Price,
            'Discount_%': req.Discount_percent,
            'Number_of_Staff': req.Number_of_Staff,
            'Weather_Condition': weather_code,
            'Local_Event': event_code
        }])

        prediction = model.predict(input_data)[0]
        
        return {
            "predicted_revenue": float(prediction),
            "confidence": "High",  # Mock confidence for API
            "inputs_used": req.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
