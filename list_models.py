import google.generativeai as genai
import os

GENAI_API_KEY = "AIzaSyD3ICAsjOUNWY36LO0znbMOE6D6U6smKYs"
genai.configure(api_key=GENAI_API_KEY)

print("Listing models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error: {e}")
