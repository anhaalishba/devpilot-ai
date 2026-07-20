# 🚀 DevPilot AI

### Your Autonomous Software Engineering Team

DevPilot AI is an AI-powered multi-agent software engineering platform that transforms natural language software ideas into production-ready applications.

Instead of relying on a single AI model, DevPilot AI uses multiple specialized AI agents that collaborate to analyze requirements, design system architecture, generate code, test the application, and perform code reviews automatically.

---

## ✨ Features

- 📋 Requirement Analysis
- 🏗️ System Architecture Design
- 💻 Production-ready Code Generation
- 🧪 Automated Testing
- 🔍 Code Review
- ⚡ FastAPI Backend
- 🎨 Modern Web Interface
- 🤖 Powered by Qwen LLM
- 🔐 Secure Environment Variables
- 📁 Clean Modular Architecture

---

# 🤖 AI Agents

## 👔 CEO Agent

- Understands the user's idea
- Identifies project scope
- Defines requirements
- Creates development plan

---

## 🏗️ Architect Agent

- Designs system architecture
- Suggests technology stack
- Creates API structure
- Plans database schema
- Defines project modules

---

## 💻 Developer Agent

- Generates production-ready code
- Builds FastAPI backend
- Creates frontend (if required)
- Implements APIs
- Writes maintainable code

---

## 🧪 Tester Agent

- Reviews generated code
- Finds bugs
- Suggests improvements
- Checks security
- Performs quality assurance

---

## 🔍 Reviewer Agent

- Reviews the complete project
- Evaluates code quality
- Suggests optimizations
- Gives final approval

---

# 🏗️ Architecture

```
User Prompt
      │
      ▼
CEO Agent
      │
      ▼
Architect Agent
      │
      ▼
Developer Agent
      │
      ▼
Reviewer Agent
      │
      ▼
Tester Agent
      │
      ▼
Final Output
```

---

# 🛠️ Tech Stack

## Backend

- Python
- FastAPI
- LangGraph
- LangChain
- Qwen LLM

## Frontend

- HTML
- CSS
- JavaScript

## Authentication

- Supabase Auth

---

# 📂 Project Structure

```
DevPilot-AI/

backend/
│
├── agents/
├── prompts/
├── graph/
├── routes/
├── services/
├── main.py
├── config.py
frontend/
│
├── index.html
├── login.html
├── style.css
├── script.js
├── auth.js
│
.env
requirements.txt
README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/anhaalishba/devpilot-ai.git

cd devpilot-ai
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Configure Environment

Create a `.env` file.

```env
QWEN_API_KEY=YOUR_API_KEY

QWEN_MODEL=qwen-plus

QWEN_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
```

---

## Run Backend

```bash
uvicorn backend.main:app --reload
```

---

## Open Frontend

Simply open

```
frontend/login.html
```

or serve it using Live Server.

---


# 🎯 Future Improvements

- Google Authentication
- GitHub Authentication
- Chat History
- Project Saving
- File Upload
- Multiple LLM Support
- Docker Support
- CI/CD
- Deployment
- Export Project
- Real-time Streaming Responses

---

# 🤝 Contributing

Contributions are welcome.

Feel free to open issues or submit pull requests.

---

# 📄 License

MIT License

---

# 👨‍💻 Developer

-**Sayed Asad Murtiza**

-**Anha Alishba**

Built for modern AI-powered software engineering.
