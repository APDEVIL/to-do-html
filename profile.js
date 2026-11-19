(() => {
  const $ = id => document.getElementById(id);
  const FACES = ["✏️", "🦊", "🐱", "🐸", "🐼", "🌵", "🍜", "🚀"];
  const COLORS = ["#e8452c", "#1f5f46", "#f08cb4", "#f2b632", "#4a6cf7"];
  let p = JSON.parse(localStorage.getItem("profile")) || { name: "", face: "✏️", color: "#e8452c" };
  let d = { ...p };                                 // draft while the pop-up is open

  function apply(x) {                               // show a profile around the page
    $("avatar").textContent = x.face;
    $("title").textContent = x.name ? `Hi ${x.name}, what needs doing today?` : "What needs doing today?";
    $("tab").textContent = `${x.name ? x.name + "'s" : "my"} notebook`;
    document.documentElement.style.setProperty("--blob", x.color);
  }

  function picker(box, items, key, paint) {         // a row of clickable choices
    box.innerHTML = "";
    items.forEach(item => {
      const b = document.createElement("button");
      b.className = d[key] === item ? "pick on" : "pick";
      paint(b, item);
      b.onclick = () => { d[key] = item; apply(d); picker(box, items, key, paint); };   // live preview
      box.appendChild(b);
    });
  }

  $("avatar").onclick = () => {                     // open the profile
    d = { ...p };
    $("pname").value = d.name;
    picker($("faces"), FACES, "face", (b, f) => b.textContent = f);
    picker($("colors"), COLORS, "color", (b, c) => b.style.background = c);
    const t = JSON.parse(localStorage.getItem("tasks")) || [];
    $("stats").textContent = `${t.length} tasks · ${t.filter(x => x.done).length} done · ${t.filter(x => x.star).length} starred`;
    $("profile").showModal();
  };
  $("pname").oninput = () => { d.name = $("pname").value.trim(); apply(d); };
  $("psave").onclick = () => { p = { ...d }; localStorage.setItem("profile", JSON.stringify(p)); $("profile").close(); };
  $("pcancel").onclick = () => $("profile").close();
  $("profile").onclose = () => apply(p);            // closing without saving undoes the preview

  addEventListener("keydown", e => {                // "/" jumps to the input
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") { e.preventDefault(); $("input").focus(); }
  });
  apply(p);
})();