const blob = document.getElementById("blob");
const body = blob.querySelector(".body");
const eyes = blob.querySelector(".eyes");
let mx = innerWidth / 2, my = innerHeight / 2;      // cursor position
let x = mx, y = my, size = 1, press = 1;            // blob position + size
addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; });
addEventListener("pointerdown", () => press = 1.35);   // blob swells when you click
addEventListener("pointerup", () => press = 1);
(function tick() {
  const dx = mx + 55 - x, dy = my + 55 - y;         // trail just beside the cursor
  x += dx * 0.08;
  y += dy * 0.08;
  size += (press - size) * 0.15;
  const stretch = Math.min(Math.hypot(dx, dy) / 200, 0.5);   // faster = longer
  const move = Math.atan2(dy, dx);                  // direction of travel
  const look = Math.atan2(my - y, mx - x);          // direction of the cursor
  blob.style.transform = `translate(${x - 35}px, ${y - 35}px)`;
  body.style.transform = `rotate(${move}rad) scale(${(1 + stretch) * size}, ${(1 - stretch * 0.4) * size})`;
  eyes.style.transform = `translate(${Math.cos(look) * 6}px, ${Math.sin(look) * 6}px)`;
  requestAnimationFrame(tick);
})();