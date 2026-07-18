// auth by supabase
(function () {
  const SUPABASE_URL = "https://nltivzbitmwjghmbqflu.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sdGl2emJpdG13amdobWJxZmx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMzg4MjIsImV4cCI6MjA5ODkxNDgyMn0.AiNWEQfzPqs5wFSN1PvEyJzIPg4Q2keCWEr2706MI2g";

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  // notification
  function getToastStack() {
    let stack = document.getElementById("toastStack");
    if (!stack) {
     
      stack = document.createElement("div");
      stack.id = "toastStack";
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    return stack;
  }

  function showToast(message, { icon = "fa-circle-check", isError = false, duration = 3000 } = {}) {
    const stack = getToastStack();
    const el = document.createElement("div");
    el.className = `toast${isError ? " toast-error" : ""}`;
    const safeMessage = document.createElement("div");
    safeMessage.textContent = message; // escape via textContent, then read innerHTML
    el.innerHTML = `<i class="fa-solid ${icon}"></i>${safeMessage.innerHTML}`;
    stack.appendChild(el);

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

  document.addEventListener("DOMContentLoaded", async () => {
    const page = window.location.pathname.split("/").pop();

    if (page === "index.html" || page === "") {
      const { data } = await supabaseClient.auth.getSession();
      if (!data.session) {
        window.location.href = "login.html";
      }
    }
  });

  async function signup() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      showToast("Please enter email and password.", { icon: "fa-triangle-exclamation", isError: true });
      return;
    }

    const { error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
      showToast(error.message, { icon: "fa-triangle-exclamation", isError: true });
      return;
    }
    showToast("Account created successfully. Please login.");
  }

  async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      showToast("Please enter email and password.", { icon: "fa-triangle-exclamation", isError: true });
      return;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      showToast(error.message, { icon: "fa-triangle-exclamation", isError: true });
      return;
    }

    showToast("Logged in — redirecting…", { duration: 600 });
    setTimeout(() => {
      window.location.href = "index.html";
    }, 600);
  }

  async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
  }

  window.signup = signup;
  window.login = login;
  window.logout = logout;
})();
