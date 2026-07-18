from typing import TypedDict


class AgentState(TypedDict):
    """
    Shared state used by all agents.
    """

    # User Input
    user_prompt: str

    # CEO Output
    requirements: str

    # Architect Output
    architecture: str

    # Developer Output
    code: str

    # Tester Output
    testing_report: str

    # Reviewer Output
    review: str

    # Workflow Status
    current_agent: str
    status: str
