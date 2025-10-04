import ee

# Only run once to authenticate
# ee.Authenticate()  # Opens browser for Google login

ee.Initialize(project = "bloom-watch-473809")       # Initialize EE for all future scripts
print("Earth Engine Initialized Successfully!")