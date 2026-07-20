from backend.services.qwen import qwen_service
from backend.prompts.architect_prompt import ARCHITECT_SYSTEM_PROMPT
from backend.models.state import AgentState


def architect_agent(state: AgentState) -> AgentState:
    """
    Architect Agent:
    Converts CEO requirements into system architecture.
    """

    try:
        # CEO output 
        requirements = state.get("requirements", "")

        if not requirements:
            state["status"] = "Architect Failed: No requirements found"
            return state

        # Call Qwen
        response = qwen_service.chat(
            system_prompt=ARCHITECT_SYSTEM_PROMPT,
            user_prompt=requirements
        )

        # Update state
        state["architecture"] = response
        state["current_agent"] = "Developer"
        state["status"] = "Architect Completed"

        return state

    except Exception as e:
        state["status"] = f"Architect Failed: {str(e)}"
        return state
