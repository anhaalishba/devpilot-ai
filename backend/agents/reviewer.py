from backend.services.qwen import qwen_service
from backend.prompts.reviewer_prompt import REVIEWER_SYSTEM_PROMPT
from backend.models.state import AgentState


def reviewer_agent(state: AgentState) -> AgentState:
    """
    Reviewer Agent:
    Final review of system (code + tests + architecture).
    """

    try:
        # Gather all previous outputs
        architecture = state.get("architecture", "")
        code = state.get("code", "")
        testing_report = state.get("testing_report", "")
        requirements = state.get("requirements", "")

        if not code:
            state["status"] = "Reviewer Failed: No code found"
            return state

        # Combine all context for final review
        review_input = f"""
        REQUIREMENTS:
        {requirements}

        ARCHITECTURE:
        {architecture}

        CODE:
        {code}

        TESTING REPORT:
        {testing_report}
        """

        # Call Qwen
        response = qwen_service.chat(
            system_prompt=REVIEWER_SYSTEM_PROMPT,
            user_prompt=review_input
        )

        # Update state
        state["review"] = response
        state["current_agent"] = "Completed"
        state["status"] = "Project Completed"

        return state

    except Exception as e:
        state["status"] = f"Reviewer Failed: {str(e)}"
        return state
