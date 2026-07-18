from backend.models.state import AgentState

from backend.agents.ceo import ceo_agent
from backend.agents.architect import architect_agent
from backend.agents.developer import developer_agent
from backend.agents.tester import tester_agent
from backend.agents.reviewer import reviewer_agent


def run_workflow(state: AgentState) -> AgentState:
    """
    Multi-Agent Workflow Controller
    Runs all agents in sequence like a software engineering team.
    """

    try:
        # Step 1: CEO
        state = ceo_agent(state)

        # Step 2: Architect
        state = architect_agent(state)

        # Step 3: Developer
        state = developer_agent(state)

        # Step 4: Tester
        state = tester_agent(state)

        # Step 5: Reviewer
        state = reviewer_agent(state)

        return state

    except Exception as e:
        state["status"] = f"Workflow Failed: {str(e)}"
        return state
