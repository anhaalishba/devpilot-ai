from backend.services.qwen import qwen_service
from backend.prompts.developer_prompt import DEVELOPER_SYSTEM_PROMPT
from backend.models.state import AgentState


def developer_agent(state: AgentState) -> AgentState:
    """
    Developer Agent:
    Converts architecture into working production code.
    """

    try:
        # Get architecture from state
        architecture = state.get("architecture", "")

        if not architecture:
            state["status"] = "Developer Failed: No architecture found"
            return state

        # Call Qwen
        response = qwen_service.chat(
            system_prompt=DEVELOPER_SYSTEM_PROMPT,
            user_prompt=architecture
        )

        # Update state
        state["code"] = response
        state["current_agent"] = "Tester"
        state["status"] = "Developer Completed"

        return state

    except Exception as e:
        state["status"] = f"Developer Failed: {str(e)}"
        return state
