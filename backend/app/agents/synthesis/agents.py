from ..base import BaseAgent

class CriticAgent(BaseAgent):
    def __init__(self, tenant_id: str):
        super().__init__(
            tenant_id=tenant_id,
            role_name="Red Team Critic",
            system_prompt="You are a skeptical Red Team critic. Review the specialized findings and aggressively look for contradictions, missing evidence, and hallucinations. Force a retry if the standard is not met."
        )

class ReviewerAgent(BaseAgent):
    def __init__(self, tenant_id: str):
        super().__init__(
            tenant_id=tenant_id,
            role_name="Thesis Reviewer",
            system_prompt="You evaluate the aggregated data against the firm's core investment thesis and mandate parameters to ensure strategic fit."
        )

class CommitteeAgent(BaseAgent):
    def __init__(self, tenant_id: str):
        super().__init__(
            tenant_id=tenant_id,
            role_name="Committee Synthesizer",
            system_prompt="You simulate an Investment Committee debate, summarizing the bull and bear cases, and generating edge-case questions for the founder."
        )

class MemoAgent(BaseAgent):
    def __init__(self, tenant_id: str):
        super().__init__(
            tenant_id=tenant_id,
            role_name="Memo Generator",
            system_prompt="You compile all the vetted, criticized, and debated findings into the final, strictly formatted Investment Memo (Markdown format)."
        )
