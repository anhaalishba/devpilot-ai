import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool

from backend.models.state import AgentState
from backend.graph.workflow import run_workflow

from backend.agents.ceo import ceo_agent
from backend.agents.architect import architect_agent
from backend.agents.developer import developer_agent
from backend.agents.tester import tester_agent
from backend.agents.reviewer import reviewer_agent


# Create router
router = APIRouter()


# Request Schema
class UserRequest(BaseModel):
    prompt: str


# orginal endpoint that runs all agents and returns the final state
@router.post("/run-agents")
def run_agents(request: UserRequest):
    """
    API endpoint to run full multi-agent system.
    """

    try:
        # Initial state
        state: AgentState = {
            "user_prompt": request.prompt,
            "requirements": "",
            "architecture": "",
            "code": "",
            "testing_report": "",
            "review": "",
            "current_agent": "CEO",
            "status": "Running"
        }

        # Run full workflow
        final_state = run_workflow(state)

        return {
            "status": final_state["status"],
            "requirements": final_state["requirements"],
            "architecture": final_state["architecture"],
            "code": final_state["code"],
            "testing_report": final_state["testing_report"],
            "review": final_state["review"]
        }

    except Exception as e:
        return {
            "status": f"API Failed: {str(e)}"
        }


#new streaming endpoint that runs all agents and streams results as they finish

AGENT_PIPELINE = [
    ("ceo", ceo_agent, "requirements"),
    ("architect", architect_agent, "architecture"),
    ("developer", developer_agent, "code"),
    ("tester", tester_agent, "testing_report"),
    ("reviewer", reviewer_agent, "review"),
]


def sse_event(data: dict) -> str:
    """Format a dict as one Server-Sent Event frame."""
    return f"data: {json.dumps(data)}\n\n"


@router.post("/run-agents-stream")
async def run_agents_stream(request: UserRequest):
    """
    Same pipeline as /run-agents, but streams a small event the moment
    EACH agent finishes, so the frontend can update that agent's card
    individually and in real time.
    """

    async def event_generator():
        state: AgentState = {
            "user_prompt": request.prompt,
            "requirements": "",
            "architecture": "",
            "code": "",
            "testing_report": "",
            "review": "",
            "current_agent": "CEO",
            "status": "Running",
        }

        for agent_id, agent_fn, field in AGENT_PIPELINE:
            yield sse_event({"type": "agent_start", "agent": agent_id})

            try:
                state = await run_in_threadpool(agent_fn, state)

                if state["status"].endswith("Failed"):
                    yield sse_event({
                        "type": "agent_error",
                        "agent": agent_id,
                        "message": state["status"],
                    })
                    return

                yield sse_event({
                    "type": "agent_done",
                    "agent": agent_id,
                    "output": state[field],
                })

            except Exception as e:
                yield sse_event({
                    "type": "agent_error",
                    "agent": agent_id,
                    "message": str(e),
                })
                return

        yield sse_event({"type": "complete"})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no", 
        },
    )
