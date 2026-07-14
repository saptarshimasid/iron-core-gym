import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from coach_agent import coach_graph
from langchain_core.messages import HumanMessage

app = FastAPI(title="Iron Core Coach Agent Server")

# Enable CORS for communication from Express.js
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

class ChatRequest(BaseModel):
  message: str

class ChatResponse(BaseModel):
  reply: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
  if not request.message.strip():
    raise HTTPException(status_code=400, detail="Message cannot be empty")
    
  try:
    print(f"Agent received message: {request.message}")
    # Invoke LangGraph state graph
    inputs = {"messages": [HumanMessage(content=request.message)]}
    result = coach_graph.invoke(inputs)
    
    # Extract final AIMessage from state
    final_messages = result["messages"]
    reply_content = final_messages[-1].content
    
    return ChatResponse(reply=reply_content)
  except Exception as e:
    print("Agent Execution Error:", str(e))
    raise HTTPException(status_code=500, detail=f"Agent failed to execute: {str(e)}")

if __name__ == "__main__":
  # Listen on port 8000
  uvicorn.run(app, host="127.0.0.1", port=8000)
