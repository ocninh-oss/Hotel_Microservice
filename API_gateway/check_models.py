from dotenv import load_dotenv
load_dotenv()
import os

import google.generativeai as genai

# Dán API Key thật của bạn vào đây
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

print("Danh sách các mô hình AI khả dụng:")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)