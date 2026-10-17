const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const temp = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  ctx.putImageData(temp, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let isDrawing = false, lastX = 0, lastY = 0, currentTool = 'brush';
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const opacity = document.getElementById('opacity');
const statusMsg = document.getElementById('statusMsg');

document.getElementById('brushTool').onclick = () => setTool('brush');
document.getElementById('eraserTool').onclick = () => setTool('eraser');
document.getElementById('clearBtn').onclick = clearCanvas;
document.getElementById('downloadBtn').onclick = downloadArt;

function setTool(tool) {
  currentTool = tool;
  document.querySelectorAll('.tool-group button').forEach(b => b.classList.remove('active'));
  document.getElementById(`${tool}Tool`).classList.add('active');
  canvas.style.cursor = tool === 'eraser' ? 'cell' : 'crosshair';
}

function startDraw(e) { isDrawing = true; [lastX, lastY] = [e.offsetX, e.offsetY]; }
function draw(e) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineWidth = brushSize.value;
  ctx.lineCap = ctx.lineJoin = 'round';
  if (currentTool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 1;
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = colorPicker.value;
    ctx.globalAlpha = opacity.value;
  }
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}
function endDraw() { isDrawing = false; }

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mouseout', endDraw);

canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const r = canvas.getBoundingClientRect();
  startDraw({offsetX: e.touches[0].clientX - r.left, offsetY: e.touches[0].clientY - r.top});
});
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const r = canvas.getBoundingClientRect();
  draw({offsetX: e.touches[0].clientX - r.left, offsetY: e.touches[0].clientY - r.top});
});
canvas.addEventListener('touchend', endDraw);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  statusMsg.textContent = 'Canvas cleared!';
  setTimeout(() => statusMsg.textContent = '', 2000);
}
function downloadArt() {
  const link = document.createElement('a');
  link.download = `my-art-${Date.now()}.png`;
  link.href = canvas.toDataURL();
  link.click();
  statusMsg.textContent = '✅ Download started!';
  setTimeout(() => statusMsg.textContent = '', 2000);
}
