// Map Selector Logic
const mapChips = document.querySelectorAll('.map-chip');
const mapItems = document.querySelectorAll('.map-item');

mapChips.forEach(chip => {
    chip.addEventListener('click', () => {
        mapChips.forEach(c => c.classList.remove('active'));
        mapItems.forEach(m => m.classList.remove('active'));
        chip.classList.add('active');
        const mapId = `map-${chip.getAttribute('data-map')}`;
        const targetMap = document.getElementById(mapId);
        if (targetMap) targetMap.classList.add('active');
        ctx.clearRect(0, 0, traceCanvas.width, traceCanvas.height);
        tracePoints = [];
    });
});

// Tactical Trace Logic
const traceBtn = document.getElementById('toggle-trace');
const clearBtn = document.getElementById('clear-trace');
const traceCanvas = document.getElementById('trace-canvas');
const ctx = traceCanvas.getContext('2d');
let isTraceMode = true; // Default to ON
let tracePoints = [];

function resizeCanvas() {
    traceCanvas.width = traceCanvas.parentElement.clientWidth;
    traceCanvas.height = 400;
    drawTrace();
}

window.addEventListener('resize', resizeCanvas);

traceBtn.addEventListener('click', () => {
    isTraceMode = !isTraceMode;
    traceBtn.classList.toggle('active');
    traceCanvas.classList.toggle('active');
    traceBtn.innerHTML = isTraceMode ? '<i data-lucide="spline"></i> Trace Mode: ON' : '<i data-lucide="spline"></i> Trace Mode: OFF';
    lucide.createIcons();
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, traceCanvas.width, traceCanvas.height);
    tracePoints = [];
});

traceCanvas.addEventListener('click', (e) => {
    if (!isTraceMode) return;
    const rect = traceCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    tracePoints.push({ x, y });
    drawTrace();
});

function drawTrace() {
    ctx.clearRect(0, 0, traceCanvas.width, traceCanvas.height);
    if (tracePoints.length === 0) return;

    ctx.strokeStyle = '#FF4D00';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    ctx.moveTo(tracePoints[0].x, tracePoints[0].y);

    tracePoints.forEach((p, index) => {
        ctx.fillStyle = '#FF4D00';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
        if (index > 0) ctx.lineTo(p.x, p.y);
    });

    ctx.stroke();

    if (tracePoints.length > 0) {
        const last = tracePoints[tracePoints.length - 1];
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Outfit';
        ctx.fillText('ENEMY PATH', last.x + 10, last.y - 10);
    }
}

window.addEventListener('load', () => {
    resizeCanvas();
    traceCanvas.classList.add('active'); // Enable interaction
});
