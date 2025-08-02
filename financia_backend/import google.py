import google.generativeai as genai

# 1) Configure your key
genai.configure(api_key="AIzaSyAiOZyplFUrmkHSu7DYb9BtbqSSvoU-kzg")

# 2) Fetch and print all available models
for model in genai.list_models():  
    # model.name is like "models/gemini-2.0-pro"  
    # model.supported_generation_methods tells you whether you can do generate_content, chat, etc.
    print(model.name, model.supported_generation_methods)
