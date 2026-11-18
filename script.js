const form = document.getElementById("form");
const input = document.getElementById("input");
const list = document.getElementById("list");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}


function render() {
  list.innerHTML = "";
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    if (task.done) li.className = "done";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.done;
    check.onchange = () => { task.done = !task.done; save(); };   

    const text = document.createElement("span");
    text.textContent = task.text;
    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.onclick = () => {                                      
      const newText = prompt("Edit task:", task.text);
      if (newText && newText.trim()) { task.text = newText.trim(); save(); }
    };

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => { tasks.splice(i, 1); save(); };          

    li.append(check, text, edit, del);
    list.appendChild(li);
  });
}
// CREATE: add a new task
form.onsubmit = e => {
  e.preventDefault();
  if (!input.value.trim()) return;
  tasks.unshift({ text: input.value.trim(), done: false });
  input.value = "";
  save();
};
render();