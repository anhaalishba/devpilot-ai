// Agent def
const AGENTS = [
    { id:"ceo",       name:"CEO Agent",       icon:"fa-user-tie",         tagLabel:"CEO",  role:"Strategic Business",     desc:"Defines vision, goals, and business strategy.",        field:"requirements",   totalTasks:2, working:"Analysing your request…" },
    { id:"architect", name:"Architect Agent", icon:"fa-cubes",            tagLabel:"ARCH", role:"System Architect",       desc:"Designs system architecture and technical roadmap.",   field:"architecture",   totalTasks:2, working:"Designing the architecture…" },
    { id:"developer", name:"Developer Agent", icon:"fa-code",             tagLabel:"DEV",  role:"Code Implementation",    desc:"Writes code and implements features.",                 field:"code",           totalTasks:3, working:"Writing source code…" },
    { id:"reviewer",  name:"Reviewer Agent",  icon:"fa-magnifying-glass", tagLabel:"REV",  role:"Code Reviewer",          desc:"Reviews code quality and provides feedback.",          field:"review",         totalTasks:2, working:"Reviewing the code…" },
    { id:"tester",    name:"Tester Agent",    icon:"fa-shield-halved",    tagLabel:"TEST", role:"Quality Assurance",      desc:"Tests functionality and ensures quality.",             field:"testing_report", totalTasks:2, working:"Running test cases…" },
];

// Stores output 
const agentOutputs = {};


// Select elements
const logEl = document.getElementById("log");
const promptEl = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");
const processing = document.getElementById("processing");
const processingLabel = document.getElementById("processingLabel");
const agentGrid = document.getElementById("agentGrid");

const modalOverlay = document.getElementById("modalOverlay");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
const toastStack = document.getElementById("toastStack");

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const newProject = document.getElementById("newProject");
const projectList = document.getElementById("projectList");

// build cards of agents
AGENTS.forEach(agent => {
    const card = document.createElement("div");
    card.className = "agent-card";
    card.id = `card-${agent.id}`;
    card.dataset.agent = agent.id;
    card.dataset.state = "waiting";
    card.innerHTML = `
        <div class="card-top">
            <div class="avatar"><i class="fa-solid ${agent.icon}"></i></div>
            <div class="card-title">
                <h3>${agent.name}</h3>
                <span class="card-tag">${agent.tagLabel} · ${agent.role}</span>
            </div>
        </div>
        <div class="card-status"><span class="status-dot"></span><span class="status-text">Waiting</span></div>
        <div class="progress-row">
            <div class="progress-track"><div class="progress-fill" style="width:0%"></div></div>
            <span class="progress-count">0/${agent.totalTasks} Tasks</span>
        </div>
        <p class="card-desc">${agent.desc}</p>
        <button class="view-details-btn" onclick="openDetails('${agent.id}')" disabled>View Details</button>
    `;
    agentGrid.appendChild(card);
});

// MOBILE MENU
menuBtn.addEventListener("click", () => sidebar.classList.toggle("showSidebar"));


// auto resize text area
promptEl.addEventListener("input", () => {
    promptEl.style.height = "auto";
    promptEl.style.height = promptEl.scrollHeight + "px";
});

promptEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener("click", sendMessage);


// project list
const PROJECTS_KEY = "aiEngineerProjects";
const DEFAULT_PROJECTS = ["Library management", "Hospital management", "E-commerce website"];

function loadProjects() {
    try {
        const raw = localStorage.getItem(PROJECTS_KEY);
        return raw ? JSON.parse(raw) : [...DEFAULT_PROJECTS];
    } catch {
        return [...DEFAULT_PROJECTS];
    }
}

function saveProjects(list) {
    try {
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
    } catch {
        // localStorage unavailable (e.g. private browsing) — fails silently,
       
    }
}

let projects = loadProjects();

function renderProjectList() {
    projectList.innerHTML = "";
    projects.forEach(name => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fa-solid fa-folder"></i>${escapeHTML(name)}`;
        projectList.appendChild(li);
    });
}
renderProjectList();

newProject.addEventListener("click", () => {
    const name = `New project ${projects.length + 1}`;
    projects.unshift(name);
    saveProjects(projects);
    renderProjectList();
});

// Log helpers
function timestamp() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function scrollBottom() {
    logEl.scrollTop = logEl.scrollHeight;
}

function addLogEntry({ role, tagLabel, tagClass, icon, bodyHTML, agentId }) {
    const div = document.createElement("div");
    div.className = `log-entry role-${role}`;
    if (agentId) div.dataset.agent = agentId;
    div.innerHTML = `
        <div class="entry-head">
            <span class="entry-tag tag-${tagClass}">${icon ? `<i class="fa-solid ${icon}"></i>` : ""}${tagLabel}</span>
            <span class="entry-time">${timestamp()}</span>
        </div>
        <div class="entry-body">${bodyHTML}</div>
    `;
    logEl.appendChild(div);

    div.querySelectorAll("pre code").forEach(block => hljs.highlightElement(block));

    scrollBottom();
    return div;
}

function addUserEntry(text) {
    addLogEntry({ role: "user", tagLabel: "you", tagClass: "user", icon: "fa-user", bodyHTML: escapeHTML(text) });
}

// Shows a temporary popup card top-right that fades out and removes itself
function showToast(message, { icon = "fa-info-circle", isError = false, duration = 2000 } = {}) {
    const el = document.createElement("div");
    el.className = `toast${isError ? " toast-error" : ""}`;
    el.innerHTML = `<i class="fa-solid ${icon}"></i>${escapeHTML(message)}`;
    toastStack.appendChild(el);

    requestAnimationFrame(() => el.classList.add("show"));

    setTimeout(() => {
        el.classList.remove("show");
        let removed = false;
        const remove = () => {
            if (removed) return;
            removed = true;
            el.remove();
        };
        el.addEventListener("transitionend", remove, { once: true });
        setTimeout(remove, 300); 
    }, duration);
}

function addErrorEntry(message) {
    showToast(message, { icon: "fa-triangle-exclamation", isError: true, duration: 2000 });
}

function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// Adds copy + download buttons under every code block
function enhanceCodeBlocks(container, filenameHint) {
    container.querySelectorAll("pre").forEach((pre, index) => {
        const codeEl = pre.querySelector("code") || pre;
        hljs.highlightElement(codeEl);

        const codeId = "code-" + Math.random().toString(36).slice(2, 9);
        codeEl.id = codeId;

        const toolbar = document.createElement("div");
        toolbar.className = "code-toolbar";
        toolbar.innerHTML = `
            <button type="button"><i class="fa-solid fa-copy"></i>Copy</button>
            <button type="button"><i class="fa-solid fa-download"></i>Download</button>
        `;
        const [copyBtn, downloadBtn] = toolbar.querySelectorAll("button");

        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(codeEl.textContent).then(() => {
                const original = copyBtn.innerHTML;
                copyBtn.innerHTML = `<i class="fa-solid fa-check"></i>Copied`;
                setTimeout(() => (copyBtn.innerHTML = original), 1200);
            });
        });

        downloadBtn.addEventListener("click", () => {
            const code = codeEl.textContent;
            const ext = guessExtension(code);
            const blob = new Blob([code], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${filenameHint || "generated-code"}-${index + 1}.${ext}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        });

        pre.insertAdjacentElement("afterend", toolbar);
    });
}

function guessExtension(code) {
    if (/^\s*(#include|int main\s*\()/m.test(code)) return "cpp";
    if (/^\s*(public\s+class|import java)/m.test(code)) return "java";
    if (/^\s*(def |import |from .+ import)/m.test(code)) return "py";
    if (/^\s*(function |const |let |=>|console\.log)/m.test(code)) return "js";
    if (/^\s*(<\?php)/m.test(code)) return "php";
    if (/^\s*(<html|<!DOCTYPE)/mi.test(code)) return "html";
    return "txt";
}

// Agent state
function setCardState(id, state, progressFraction) {
    const agent = AGENTS.find(a => a.id === id);
    const card = document.getElementById(`card-${id}`);
    card.dataset.state = state;

    const statusText = card.querySelector(".status-text");
    const progressFill = card.querySelector(".progress-fill");
    const progressCount = card.querySelector(".progress-count");
    const detailsBtn = card.querySelector(".view-details-btn");

    const labels = { waiting: "Waiting", running: "Active", finished: "Completed", failed: "Failed" };
    statusText.textContent = labels[state];

    const done = state === "finished" ? agent.totalTasks
        : state === "running" ? Math.max(1, Math.round(agent.totalTasks * (progressFraction ?? 0.6)))
        : 0;

    progressFill.style.width = `${(done / agent.totalTasks) * 100}%`;
    progressCount.textContent = `${done}/${agent.totalTasks} Tasks`;

    detailsBtn.disabled = !(state === "finished" || state === "failed");
}

function resetCards() {
    AGENTS.forEach(agent => setCardState(agent.id, "waiting"));
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// STREAMING PIPELINE: Reads Server-Sent Events from /run-agents-stream as they arrive, so each  card updates the instant THAT agent actually finishes on the backend —

async function streamAgents(prompt, handlers) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 700000); // ~11.5 min overall safety net

    const res = await fetch("http://localhost:8000/api/run-agents-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
    });

    if (!res.ok || !res.body) {
        clearTimeout(timeoutId);
        throw new Error(`Stream request failed (status ${res.status})`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let boundary;
        while ((boundary = buffer.indexOf("\n\n")) !== -1) {
            const rawEvent = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);

            const dataLine = rawEvent.split("\n").find(line => line.startsWith("data:"));
            if (!dataLine) continue;

            let payload;
            try {
                payload = JSON.parse(dataLine.slice(5).trim());
            } catch {
                continue; 
            }

            if (payload.type === "agent_start") handlers.onAgentStart?.(payload.agent);
            else if (payload.type === "agent_done") handlers.onAgentDone?.(payload.agent, payload.output);
            else if (payload.type === "agent_error") handlers.onAgentError?.(payload.agent, payload.message);
            else if (payload.type === "complete") handlers.onComplete?.();
        }
    }

    clearTimeout(timeoutId);
}


// Details modal
function openDetails(id) {
    const agent = AGENTS.find(a => a.id === id);
    const output = agentOutputs[id];

    modalBody.innerHTML = `
        <div class="modal-head">
            <div class="avatar"><i class="fa-solid ${agent.icon}"></i></div>
            <div>
                <h2>${agent.name}</h2>
                <p>${agent.role}</p>
            </div>
        </div>
        <div class="modal-body-text" id="modalBodyText">
            ${output ? marked.parse(output) : `<p>This agent hasn't produced output yet — send a request first.</p>`}
        </div>
    `;

    if (output) {
        enhanceCodeBlocks(document.getElementById("modalBodyText"), `${id}-output`);
    }

    modalOverlay.classList.add("open");
}

function closeDetails() {
    modalOverlay.classList.remove("open");
}

modalClose.addEventListener("click", closeDetails);
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeDetails();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetails();
});


// SEND MESSAGE — runs the real pipeline
let isRunning = false;

async function sendMessage() {
    if (isRunning) return;

    const text = promptEl.value.trim();
    if (text === "") return;

    isRunning = true;
    sendBtn.disabled = true;

    addUserEntry(text);
    promptEl.value = "";
    promptEl.style.height = "auto";

    resetCards();
    processing.classList.add("active");
    processingLabel.textContent = "Starting…";

    const finishedAgents = new Set();

    try {
        await streamAgents(text, {
            onAgentStart(agentId) {
                setCardState(agentId, "running");
                const agent = AGENTS.find(a => a.id === agentId);
                if (agent) processingLabel.textContent = agent.working;
            },
            onAgentDone(agentId, output) {
                setCardState(agentId, "finished");
                agentOutputs[agentId] = output || "No output returned for this stage.";
                finishedAgents.add(agentId);
            },
            onAgentError(agentId, message) {
                setCardState(agentId, "failed");
                finishedAgents.add(agentId);
                addErrorEntry(`${agentId}: ${message}`);
            },
        });

        //message if the stream ended early (connection dropped, backend
       
        AGENTS.forEach(agent => {
            if (!finishedAgents.has(agent.id)) setCardState(agent.id, "failed");
        });
    } catch (err) {
        AGENTS.forEach(agent => {
            if (!finishedAgents.has(agent.id)) setCardState(agent.id, "failed");
        });
        const msg = err.name === "AbortError"
            ? "Backend did not respond in time. Is it running at localhost:8000?"
            : "Backend error: " + err.message;
        addErrorEntry(msg);
    } finally {
        processing.classList.remove("active");
        isRunning = false;
        sendBtn.disabled = false;
    }
}

// profile+logout
const accountBtn = document.getElementById("accountBtn");
const accountMenu = document.getElementById("accountMenu");
const logoutBtn = document.getElementById("logoutBtn");

if (accountBtn) {
    accountBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        accountMenu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
        if (!accountMenu.contains(e.target) && e.target !== accountBtn) {
            accountMenu.classList.remove("show");
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        if (typeof logout === "function") {
            logout();
        }
    });
}