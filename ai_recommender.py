import openai
import config

openai.api_key = config.OPENAI_API_KEY

def get_ai_suggestion(origin, destination, preference):
    prompt = f"Suggest the best flight route from {origin} to {destination} based on {preference}."
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response["choices"][0]["message"]["content"]
