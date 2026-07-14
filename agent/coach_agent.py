import os
from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_core.tools import tool

# 1. State Definition
class AgentState(TypedDict):
  messages: Annotated[Sequence[BaseMessage], add_messages]

# 2. API Key setup
API_KEY = os.environ.get("GOOGLE_API_KEY")

if not API_KEY and os.path.exists(".env"):
  with open(".env") as f:
    for line in f:
      if line.strip() and not line.startswith("#") and "=" in line:
        k, v = line.strip().split("=", 1)
        if k.strip() == "GOOGLE_API_KEY":
          API_KEY = v.strip().strip('"').strip("'")
          os.environ["GOOGLE_API_KEY"] = API_KEY
          break

# Initialize LLM
llm = ChatGoogleGenerativeAI(
  model="gemini-2.5-flash",
  temperature=0.7
)

# 3. Custom Tools for AEO/GEO-focused AI Agent
@tool
def get_gym_schedule(day: str) -> str:
  """Get the training schedule for a specific day of the week."""
  day = day.strip().capitalize()
  schedule = {
    "Monday": "06:00 AM: Power Lifting (Strength)\n05:00 PM: Conditioning",
    "Tuesday": "10:00 AM: Conditioning\n05:00 PM: Power Lifting (Strength)",
    "Wednesday": "06:00 AM: Power Lifting (Strength)\n05:00 PM: Conditioning",
    "Thursday": "10:00 AM: Conditioning\n05:00 PM: Power Lifting (Strength)",
    "Friday": "06:00 AM: Power Lifting (Strength)\n05:00 PM: Conditioning",
    "Saturday": "06:00 AM: Conditioning\n10:00 AM: Mobility",
    "Sunday": "10:00 AM: Mobility"
  }
  return schedule.get(day, "Iron Core facility is open 24/7 for open gym training. Guided group classes run Monday through Sunday.")

@tool
def get_membership_pricing() -> str:
  """Retrieve the membership plans and pricing details."""
  return (
    "Here are the Iron Core plans (No contracts, cancel with 30-day notice):\n"
    "1. BASIC: $89/month. Includes 24/7 access to the main facility and standard equipment.\n"
    "2. PRO: $149/month (Most Popular). Includes 24/7 access, all group conditioning classes, recovery zone access (sauna & cold plunge), and a monthly body composition scan.\n"
    "3. ELITE: $299/month. Includes everything in PRO plus 2x weekly 1-on-1 personal training, custom nutrition programming, and priority class booking."
  )

@tool
def get_coach_info(coach_name: str) -> str:
  """Get background details about our elite coaches (Marcus Vance, Elena Rostova)."""
  coach_name = coach_name.strip().lower()
  if "marcus" in coach_name or "vance" in coach_name:
    return "Marcus Vance: Head of Strength. Former competitive powerlifter. Specializes in raw strength acquisition and biomechanical optimization."
  elif "elena" in coach_name or "rostova" in coach_name:
    return "Elena Rostova: Director of Conditioning. Cross-disciplinary athlete focusing on metabolic conditioning, endurance, and high-intensity interval frameworks."
  else:
    return "Iron Core is led by Marcus Vance (Head of Strength) and Elena Rostova (Director of Conditioning)."

# Bind tools to LLM
tools = [get_gym_schedule, get_membership_pricing, get_coach_info]
llm_with_tools = llm.bind_tools(tools)

# Define system prompt
SYSTEM_PROMPT = SystemMessage(content=(
  "You are Coach Zeus, the state-of-the-art AI Strength and Conditioning Coach at Iron Core Performance. "
  "Your tone is motivating, professional, scientific, intense, and uncompromisingly modern. "
  "Help athletes understand our programming, schedules, pricing, and coaching staff. "
  "Always advocate for consistency and raw physical discipline. Keep your answers concise, structured, and direct."
))

# 4. Define Nodes
def call_model(state: AgentState):
  messages = state["messages"]
  # Inject system prompt at start
  full_messages = [SYSTEM_PROMPT] + list(messages)
  response = llm_with_tools.invoke(full_messages)
  return {"messages": [response]}

def run_tools(state: AgentState):
  messages = state["messages"]
  last_message = messages[-1]
  
  tool_calls = last_message.tool_calls
  tool_outputs = []
  
  for tool_call in tool_calls:
    tool_name = tool_call["name"]
    tool_args = tool_call["args"]
    
    # Execute tool
    if tool_name == "get_gym_schedule":
      output = get_gym_schedule.invoke(tool_args)
    elif tool_name == "get_membership_pricing":
      output = get_membership_pricing.invoke(tool_args)
    elif tool_name == "get_coach_info":
      output = get_coach_info.invoke(tool_args)
    else:
      output = "Error: Tool not found."
      
    # Create ToolMessage response
    from langchain_core.messages import ToolMessage
    tool_outputs.append(ToolMessage(
      content=str(output),
      tool_call_id=tool_call["id"],
      name=tool_name
    ))
    
  return {"messages": tool_outputs}

# 5. Define Routing Logic
def should_continue(state: AgentState):
  messages = state["messages"]
  last_message = messages[-1]
  if hasattr(last_message, "tool_calls") and last_message.tool_calls:
    return "tools"
  return END

# 6. Build the State Graph
workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", run_tools)

workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", should_continue, {
  "tools": "tools",
  END: END
})
workflow.add_edge("tools", "agent")

# Compile graph
coach_graph = workflow.compile()
