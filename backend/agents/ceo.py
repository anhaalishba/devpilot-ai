from backend.services.qwen import qwen_service
from backend.prompts.ceo_prompt import CEO_SYSTEM_PROMPT
from backend.models.state import AgentState


def ceo_agent(state: AgentState) -> AgentState:
    """
    CEO Agent:
    Converts user idea into structured software requirements.
    """

    user_input = state["user_prompt"]

    try:
        # Call Qwen model via service
        response = qwen_service.chat(
            system_prompt=CEO_SYSTEM_PROMPT,
            user_prompt=user_input
        )

        # Update state
        state["requirements"] = response
        state["current_agent"] = "Architect"
        state["status"] = "CEO Completed"

        return state

    except Exception as e:
        state["status"] = f"CEO Failed: {str(e)}"
        return state
