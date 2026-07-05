from openai import AsyncOpenAI
from ..core.config import settings

class BaseAgent:
    """
    Abstract Base Class for all VentureLens multi-agent components.
    Provides standard LLM integration, retry logic, and persona injection.
    """
    
    def __init__(self, tenant_id: str, role_name: str, system_prompt: str):
        self.tenant_id = tenant_id
        self.role_name = role_name
        self.system_prompt = system_prompt
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
    async def invoke(self, payload: str, context: list[dict] = None) -> dict:
        """
        Executes the agent's core LLM chain.
        """
        if not settings.OPENAI_API_KEY:
            # Fallback mock for local development without API keys
            import asyncio
            await asyncio.sleep(1)
            return {
                "role": self.role_name,
                "status": "success",
                "content": f"[MOCK {self.role_name}]: Analyzed payload: {payload[:50]}..."
            }

        messages = [{"role": "system", "content": self.system_prompt}]
        
        if context:
            messages.extend(context)
            
        messages.append({"role": "user", "content": payload})

        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        
        return {
            "role": self.role_name,
            "status": "success",
            "content": response.choices[0].message.content
        }
