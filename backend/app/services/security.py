import re
from fastapi import HTTPException
import logging

logger = logging.getLogger("venturelens.security")

PROMPT_INJECTION_PATTERNS = [
    r"ignore all previous instructions",
    r"system override",
    r"you are now acting as",
    r"forget everything",
    r"bypass standard protocol"
]

class SecurityService:
    @staticmethod
    def sanitize_llm_input(text: str) -> str:
        """
        Layer 1: Document Sanitization (basic removal of hidden control chars).
        """
        # Remove non-printable characters that might confuse LLMs
        text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', text)
        return text

    @staticmethod
    def detect_prompt_injection(text: str) -> bool:
        """
        Layer 2: Fast regex-based Prompt Injection detection.
        In an enterprise setting, this would be supplemented by Lakera Guard or a dedicated classification model.
        """
        text_lower = text.lower()
        for pattern in PROMPT_INJECTION_PATTERNS:
            if re.search(pattern, text_lower):
                logger.warning(f"Potential prompt injection detected: {pattern}")
                return True
        return False
        
    @staticmethod
    def enforce_safe_input(text: str) -> str:
        """
        Applies both sanitization and injection detection.
        Throws a 400 error if injection is detected.
        """
        sanitized = SecurityService.sanitize_llm_input(text)
        if SecurityService.detect_prompt_injection(sanitized):
            raise HTTPException(status_code=400, detail="Document rejected: Security policy violation (Prompt Injection).")
        return sanitized
