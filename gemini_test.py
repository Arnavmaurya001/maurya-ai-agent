import google.generativeai as genai

# Configure the Gemini API with the provided trial key
genai.configure(api_key="AIzaSyB1zVEjuu9Ksweu6w58LyeCj8JtEDs1_jU")

# Initialize the Gemini 2.5 Flash model
model = genai.GenerativeModel("gemini-2.5-flash")

# Generate a simple response
response = model.generate_content("Hello!")
print(response.text)
