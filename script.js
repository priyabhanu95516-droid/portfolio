// Mobile menu
const burger = document.getElementById("burger"),
  links = document.getElementById("links");
burger.onclick = () => {
  const o = links.classList.toggle("open");
  burger.setAttribute("aria-expanded", o);
  burger.textContent = o ? "✕" : "☰";
};
links.querySelectorAll("a").forEach(
  (a) =>
    (a.onclick = () => {
      links.classList.remove("open");
      burger.textContent = "☰";
    }),
);

// Active link + back-to-top
const secs = [...document.querySelectorAll("main section")],
  navA = [...links.querySelectorAll("a")],
  topBtn = document.getElementById("top");
addEventListener("scroll", () => {
  let cur = "home";
  secs.forEach((s) => {
    if (scrollY >= s.offsetTop - 120) cur = s.id;
  });
  navA.forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + cur),
  );
  topBtn.classList.toggle("show", scrollY > 500);
});
topBtn.onclick = () => scrollTo({ top: 0, behavior: "smooth" });

// Reveal on scroll
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.1 },
);
document.querySelectorAll(".rv").forEach((el) => io.observe(el));

// Contact form validation
const FORM_ENDPOINT = ""; // Formspree URL yahan daalo, e.g. https://formspree.io/f/xxxx
const MY_EMAIL = "priyabhanu95516@gmail.com"; // FORM_ENDPOINT khali ho to mail app khulegi
const form = document.getElementById("form"),
  ok = document.getElementById("ok");
const rules = {
  name: (v) =>
    !v
      ? "Name is required."
      : v.length < 2
        ? "Name must be at least 2 characters."
        : !/^[A-Za-z .'-]+$/.test(v)
          ? "Name can contain only letters."
          : "",
  email: (v) =>
    !v
      ? "Email is required."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
        ? "Enter a valid email address."
        : "",
  message: (v) =>
    !v
      ? "Message is required."
      : v.length < 10
        ? "Message must be at least 10 characters."
        : v.length > 1000
          ? "Message is too long (max 1000)."
          : "",
};
function check(el) {
  const box = el.closest(".f"),
    msg = rules[el.name](el.value.trim());
  box.querySelector(".err").textContent = msg;
  box.classList.toggle("bad", !!msg);
  box.classList.toggle("good", !msg);
  return !msg;
}
form.querySelectorAll("input,textarea").forEach((el) => {
  el.addEventListener("blur", () => check(el));
  el.addEventListener("input", () => {
    if (el.closest(".f").classList.contains("bad")) check(el);
  });
});
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  ok.style.display = "none";
  const fields = [...form.querySelectorAll("input,textarea")];
  const valid = fields.map(check).every(Boolean);
  if (!valid) {
    fields.find((f) => f.closest(".f").classList.contains("bad")).focus();
    return;
  }
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim(),
  };
  const btn = document.getElementById("send");
  btn.disabled = true;
  btn.textContent = "Sending...";
  try {
    if (FORM_ENDPOINT) {
      const r = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!r.ok) throw 0;
    } else {
      location.href = `mailto:${MY_EMAIL}?subject=${encodeURIComponent("Portfolio message from " + data.name)}&body=${encodeURIComponent(data.message + "\n\nFrom: " + data.name + " (" + data.email + ")")}`;
    }
    ok.textContent =
      "Thank you, " + data.name + "! Your message has been sent.";
    ok.style.display = "block";
    form.reset();
    fields.forEach((f) => f.closest(".f").classList.remove("good", "bad"));
  } catch {
    ok.style.cssText =
      "display:block;color:#ff6b81;border-color:#ff6b81;background:#ff6b8122";
    ok.textContent = "Something went wrong. Please try again.";
  }
  btn.disabled = false;
  btn.textContent = "Send Message ➤";
});
