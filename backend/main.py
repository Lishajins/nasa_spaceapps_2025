from fastapi import FastAPI
from pydantic import BaseModel
from ndvi_fetcher import get_ndvi

app = FastAPI()

class NDVIRequest(BaseModel):
    lat: float
    lon: float
    start_date: str
    end_date: str

@app.post("/ndvi")
def fetch_ndvi(request: NDVIRequest):
    ndvi_value = get_ndvi(request.lat, request.lon, request.start_date, request.end_date)
    return {"ndvi": ndvi_value}
