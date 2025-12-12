import streamlit as st
import requests
import uuid

# Configuration
API_URL = "http://127.0.0.1:8000/api/v1/plan-intake-agent"  # Adjust if your FastAPI port differs

st.title("Triathlon Coach Agent Test")

# 1. Session Setup (Generate a unique Thread ID for this test run)
if "thread_id" not in st.session_state:
    st.session_state.thread_id = str(uuid.uuid4())
    st.session_state.messages = []
    st.session_state.current_profile = {}
    st.session_state.agent_debug = {"errors": [], "last_tool_calls": [], "validation_events": []}
    
    # --- COLD START TRIGGER ---
    # We call the /start endpoint to get the AI's first message
    with st.spinner("Waking up agent..."):
        try:
            res = requests.post(
                f"{API_URL}/start", 
                params={"thread_id": st.session_state.thread_id}
            )
            if res.status_code == 200:
                payload = res.json()
                ai_msg = payload.get("response")
                st.session_state.messages.append({"role": "assistant", "content": ai_msg})
                st.session_state.agent_debug = payload.get("debug", st.session_state.agent_debug)
        except Exception as e:
            st.error(f"Could not connect to backend: {e}")
else:
    st.session_state.setdefault("current_profile", {})
    st.session_state.setdefault("agent_debug", {"errors": [], "last_tool_calls": [], "validation_events": []})

# 2. Display Chat History
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

# 3. Handle User Input
if prompt := st.chat_input("Type your reply..."):
    # Add user message to UI immediately
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

    # Call the API
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            res = requests.post(
                f"{API_URL}/chat",
                params={"user_message": prompt, "thread_id": st.session_state.thread_id}
            )
            
            if res.status_code == 200:
                data = res.json()
                response_text = data.get("response")
                current_profile = data.get("current_profile", {})
                debug_info = data.get("debug", {})
                
                st.write(response_text)

                # Update history
                st.session_state.messages.append({"role": "assistant", "content": response_text})
                st.session_state.current_profile = current_profile or {}
                if debug_info:
                    st.session_state.agent_debug = debug_info
            else:
                st.error("Error from API")
                

def render_agent_sidebar():
    with st.sidebar:
        st.subheader("Current Agent State")
        st.json(st.session_state.get("current_profile", {}))
        
        debug_info = st.session_state.get("agent_debug", {})
        st.subheader("Agent Decisions")
        
        errors = debug_info.get("errors") or []
        if errors:
            st.error("\n".join(errors))
        
        tool_calls = debug_info.get("last_tool_calls") or []
        if tool_calls:
            st.markdown("**Latest Tool Calls**")
            for call in tool_calls:
                st.write(f"{call.get('name') or 'unknown'} → {call.get('args')}")
        
        validations = debug_info.get("validation_events") or []
        if validations:
            st.markdown("**Validator Feedback**")
            for event in reversed(validations):
                label = event.get("tool_call_id") or "validator"
                st.write(f"{label}: {event.get('result')}")


render_agent_sidebar()
