const $ = id => document.getElementById(id);
const el = (tag, text = "", cls = "") => { const e = document.createElement(tag); e.textContent = text; e.className = cls; return e; };
const tabs = document.querySelectorAll(".filters button");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [], filter = "all";
function save() {                                   // starred first, store, redraw
  tasks.sort((a, b) => !!b.star - !!a.star);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}
function render() {                                 // READ (filter + search)
  const done = tasks.filter(t => t.done).length, q = $("search").value.toLowerCase();
  $("clear").textContent = `clear done (${done})`;
  $("bar").style.width = tasks.length ? (done / tasks.length) * 100 + "%" : "0%";
  $("sub").textContent = !tasks.length ? "Add a task and tick it off when you're done."
    : done === tasks.length ? "all done. go touch grass 🌱" : `${tasks.length - done} left. you've got this!`;
  $("list").innerHTML = "";
  tasks.forEach(task => {
    if ((filter === "active" && task.done) || (filter === "done" && !task.done) || !task.text.toLowerCase().includes(q)) return;
    const li = el("li", "", (task.done ? "done " : "") + (task.star ? "starred" : ""));
    const check = Object.assign(el("input"), { type: "checkbox", checked: task.done });
    check.onchange = () => { task.done = !task.done; save(); };   // UPDATE (status)
    const star = el("button", task.star ? "★" : "☆", "star");
    star.onclick = () => { task.star = !task.star; save(); };     // UPDATE (pin)
    const edit = el("button", "edit");
    edit.onclick = () => {                                        // UPDATE (text)
      const t = prompt("Edit task:", task.text);
      if (t && t.trim()) { task.text = t.trim(); save(); }
    };
    const del = el("button", "delete");
    del.onclick = () => { tasks = tasks.filter(t => t !== task); save(); };   // DELETE
    li.append(check, el("span", task.text), star, edit, del);
    $("list").appendChild(li);
  });
}
$("form").onsubmit = e => {                         // CREATE
  e.preventDefault();
  const text = $("input").value.trim();
  if (!text) return;
  tasks.unshift({ text, done: false });
  $("input").value = "";
  save();
};
tabs.forEach(b => b.onclick = () => {               // filter tabs
  filter = b.dataset.filter;
  tabs.forEach(x => x.classList.toggle("on", x === b));
  render();
});
$("search").oninput = render;                       // live search
$("clear").onclick = () => { tasks = tasks.filter(t => !t.done); save(); };
render();