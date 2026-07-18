from openai import OpenAI
from config import (
    QWEN_API_KEY,
    QWEN_BASE_URL,
    QWEN_MODEL
)


class QwenService:
    """
    Service class for interacting with Qwen Cloud.
    """

    def __init__(self):
        self.client = OpenAI(
            api_key=QWEN_API_KEY,
            base_url=QWEN_BASE_URL
        )

    def chat(self, system_prompt: str, user_prompt: str) -> str:
        """
        Send a chat request to Qwen Cloud.
        """

        try:

            response = self.client.chat.completions.create(

                model=QWEN_MODEL,

                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": user_prompt
                    }
                ],

                temperature=0.7

            )

            return response.choices[0].message.content

        except Exception as error:

            print(f"Qwen Error: {error}")

            return "Unable to generate response."


# Global Service Instance
qwen_service = QwenService()
