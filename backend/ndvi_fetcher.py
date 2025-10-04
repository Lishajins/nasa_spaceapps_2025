import ee
try:
    ee.Initialize(project="bloom-watch-473809")
except Exception as e:
    ee.Authenticate()   # Only needed once; opens a browser for login
    ee.Initialize(project="bloom-watch-473809")

def get_ndvi(lat, lon, start_date, end_date):
    roi = ee.Geometry.Point([lon, lat])   # Your point of interest
    dataset = ee.ImageCollection('MODIS/006/MOD13Q1') \
        .filterBounds(roi) \
        .filterDate(start_date, end_date) \
        .select('NDVI')

    mean_ndvi = dataset.mean().clip(roi)
    ndvi_dict = mean_ndvi.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=roi,
        scale=250,
        maxPixels=1e8
    ).getInfo()

    return ndvi_dict.get('NDVI')
