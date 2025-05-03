import os
import logging
import google.generativeai as genai

logging.basicConfig(level=logging.INFO)

def test_gemini_api():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logging.error("GEMINI_API_KEY environment variable is not set.")
        return

    genai.configure(api_key=api_key)

    prompt = (
        "You are a crypto investment assistant.\n"
        "Given the following list of coins:\n"
        "bitcoin, ethereum, solana\n\n"
        "Please recommend the best coin to invest in right now and provide clear reasons for your recommendation.\n"
    )

    try:
        model = genai.GenerativeModel("gemini-1.5-pro-latest")
        logging.info("Calling Gemini API for test prompt...")
        response = model.generate_content(prompt)
        if not response or not hasattr(response, 'text') or not response.text.strip():
            logging.error("AI response is invalid or empty")
            return
        recommendation = response.text.strip()
        logging.info(f"AI recommendation:\n{recommendation}")
    except Exception as e:
        logging.error(f"Gemini API call failed: {str(e)}")

if __name__ == "__main__":
    test_gemini_api()
