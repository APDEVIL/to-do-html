const $ = id => document.getElementById(id);
const el = (tag, text = "", cls = "") => { const e = document.createElement(tag); e.textContent = text; e.className = cls; return e; };
const tabs = document.querySelectorAll(".filters button");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [], filter = "all";
function save() {                                   // store, then redraw
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}
function render() {                                 // READ (respects the filter)
  const done = tasks.filter(t => t.done).length;
  $("clear").textContent = `clear done (${done})`;
  $("bar").style.width = tasks.length ? (done / tasks.length) * 100 + "%" : "0%";
  $("list").innerHTML = "";
  tasks.forEach((task, i) => {
    if ((filter === "active" && task.done) || (filter === "done" && !task.done)) return;
    const li = el("li", "", task.done ? "done" : "");
    const check = Object.assign(el("input"), { type: "checkbox", checked: task.done });
    check.onchange = () => { task.done = !task.done; save(); };   // UPDATE (status)
    const edit = el("button", "edit");
    edit.onclick = () => {                                        // UPDATE (text)
      const t = prompt("Edit task:", task.text);
      if (t && t.trim()) { task.text = t.trim(); save(); }
    };
    const del = el("button", "delete");
    del.onclick = () => { tasks.splice(i, 1); save(); };          // DELETE
    li.append(check, el("span", task.text), edit, del);
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
$("clear").onclick = () => { tasks = tasks.filter(t => !t.done); save(); };   // clear finished
addEventListener("keydown", e => {                  // "/" focuses the input
  if (e.key === "/" && document.activeElement !== $("input")) { e.preventDefault(); $("input").focus(); }
});
render();