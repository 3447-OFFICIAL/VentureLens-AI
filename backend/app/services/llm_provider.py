import os
import time
import logging
from typing import Generator, Optional
from app.core.config import settings

logger = logging.getLogger("venturelens_llm")

class LLMProvider:
    @staticmethod
    def get_provider_and_model() -> tuple[str, str]:
        # Switch model based on environment or default to Gemini/OpenAI
        provider = os.getenv("LLM_PROVIDER", "gemini").lower()
        model = os.getenv("LLM_MODEL", "")
        
        if not model:
            defaults = {
                "openai": "gpt-4o",
                "claude": "claude-3-5-sonnet-20241022",
                "gemini": "gemini-1.5-flash",
                "deepseek": "deepseek-chat",
                "llama": "llama3-8b"
            }
            model = defaults.get(provider, "gemini-1.5-flash")
        return provider, model

    @staticmethod
    def generate(prompt: str, system_instruction: Optional[str] = None) -> str:
        provider, model = LLMProvider.get_provider_and_model()
        api_key = getattr(settings, f"{provider.upper()}_API_KEY", "")
        
        logger.info(f"Generating text using LLM provider: {provider}, model: {model}")
        
        if not api_key:
            logger.warning(f"API key missing for provider {provider}. Running local mock response.")
            return LLMProvider._mock_response(prompt)

        try:
            if provider == "openai":
                from openai import OpenAI
                client = OpenAI(api_key=api_key)
                messages = []
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                messages.append({"role": "user", "content": prompt})
                
                res = client.chat.completions.create(
                    model=model,
                    messages=messages,
                    temperature=0.2
                )
                return res.choices[0].message.content or ""
                
            elif provider == "gemini":
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                generation_config = {"temperature": 0.2}
                
                # If system instructions are supported by the model
                model_client = genai.GenerativeModel(
                    model_name=model,
                    generation_config=generation_config,
                    system_instruction=system_instruction
                )
                res = model_client.generate_content(prompt)
                return res.text
                
            elif provider == "claude":
                import anthropic
                client = anthropic.Anthropic(api_key=api_key)
                system_arg = system_instruction if system_instruction else anthropic.NOT_GIVEN
                res = client.messages.create(
                    model=model,
                    max_tokens=2048,
                    system=system_arg,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.2
                )
                return res.content[0].text
                
            else:
                return LLMProvider._mock_response(prompt)
        except Exception as e:
            logger.error(f"Error calling LLM provider {provider}: {e}")
            return f"Error executing AI generation: {str(e)}"

    @staticmethod
    def generate_stream(prompt: str, system_instruction: Optional[str] = None) -> Generator[str, None, None]:
        provider, model = LLMProvider.get_provider_and_model()
        api_key = getattr(settings, f"{provider.upper()}_API_KEY", "")
        
        logger.info(f"Streaming text using LLM provider: {provider}, model: {model}")
        
        if not api_key:
            logger.warning(f"API key missing for provider {provider}. Streaming local mock response.")
            for chunk in LLMProvider._mock_stream(prompt):
                yield chunk
            return

        try:
            if provider == "openai":
                from openai import OpenAI
                client = OpenAI(api_key=api_key)
                messages = []
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                messages.append({"role": "user", "content": prompt})
                
                stream = client.chat.completions.create(
                    model=model,
                    messages=messages,
                    stream=True,
                    temperature=0.2
                )
                for chunk in stream:
                    content = chunk.choices[0].delta.content
                    if content:
                        yield content
                        
            elif provider == "gemini":
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                model_client = genai.GenerativeModel(
                    model_name=model,
                    system_instruction=system_instruction
                )
                stream = model_client.generate_content(prompt, stream=True)
                for chunk in stream:
                    if chunk.text:
                        yield chunk.text
                        
            elif provider == "claude":
                import anthropic
                client = anthropic.Anthropic(api_key=api_key)
                system_arg = system_instruction if system_instruction else anthropic.NOT_GIVEN
                with client.messages.stream(
                    model=model,
                    max_tokens=2048,
                    system=system_arg,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.2
                ) as stream:
                    for text in stream.text_stream:
                        yield text
            else:
                for chunk in LLMProvider._mock_stream(prompt):
                    yield chunk
        except Exception as e:
            logger.error(f"Error calling LLM stream provider {provider}: {e}")
            yield f"\n[AI Error: {str(e)}]"

    @staticmethod
    def _mock_response(prompt: str) -> str:
        prompt_lower = prompt.lower()
        if "runway" in prompt_lower or "synthoai" in prompt_lower:
            return "Based on the retrieved financial statement chunks for SynthoAI, the company shows an ARR of $12.4M andMRR of $1M. With a burn rate of $250k/month, the runway is estimated at 14.4 months. LTV/CAC ratio is 4.5x, indicating healthy efficiency."
        elif "ecomove" in prompt_lower or "concentration" in prompt_lower:
            return "EcoMove has a high concentration risk: the top 3 clients represent 48% of total MRR. We suggest structuring multi-year contracts."
        return "I am VentureLens AI due diligence assistant. I can extract cap table metrics, analyze pitch decks, calculate cash runways, and generate committee memos."

    @staticmethod
    def _mock_stream(prompt: str) -> Generator[str, None, None]:
        text = LLMProvider._mock_response(prompt)
        words = text.split(" ")
        for word in words:
            yield word + " "
            time.sleep(0.08)
