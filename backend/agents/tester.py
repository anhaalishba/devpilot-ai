from backend.services.qwen import qwen_service
from backend.prompts.tester_prompt import TESTER_SYSTEM_PROMPT
from backend.models.state import AgentState


def tester_agent(state: AgentState) -> AgentState:
    """
    Tester Agent:
    Analyzes developer code and finds bugs/issues.
    """

    try:
        # Get code from developer
        code = state.get("code", "")

        if not code:
            state["status"] = "Tester Failed: No code found"
            return state

        # Call Qwen
        response = qwen_service.chat(
            system_prompt=TESTER_SYSTEM_PROMPT,
            user_prompt=code
        )

        # Update state
        state["testing_report"] = response
        state["current_agent"] = "Reviewer"
        state["status"] = "Tester Completed"

        return state

    except Exception as e:
        state["status"] = f"Tester Failed: {str(e)}"
        return state
