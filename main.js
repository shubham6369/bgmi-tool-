const mapChips = document.querySelectorAll('.map-chip');
const mapItems = document.querySelectorAll('.map-item');
const traceCanvas = document.getElementById('trace-canvas');
const ctx = traceCanvas.getContext('2d');
const clearBtn = document.getElementById('clear-trace');
const pipVideo = document.getElementById('pip-video');
const pipBtn = document.getElementById('launch-overlay');

let tracePoints = [];

// Initialize Canvas
function resizeCanvas() {
    traceCanvas.width = traceCanvas.parentElement.clientWidth;
    traceCanvas.height = traceCanvas.parentElement.clientHeight;
}

// Switching Maps
mapChips.forEach(chip => {
    chip.addEventListener('click', () => {
        mapChips.forEach(c => c.classList.remove('active'));
        mapItems.forEach(m => m.classList.remove('active'));
        chip.classList.add('active');
        document.getElementById(`map-${chip.getAttribute('data-map')}`).classList.add('active');
        clearTrace();
    });
});

// Drawing Logic
traceCanvas.addEventListener('click', (e) => {
    const rect = traceCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    tracePoints.push({ x, y });
    drawTrace();
});

function drawTrace() {
    ctx.clearRect(0, 0, traceCanvas.width, traceCanvas.height);
    if (tracePoints.length === 0) return;

    ctx.strokeStyle = '#FF3300';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 4]);

    ctx.beginPath();
    ctx.moveTo(tracePoints[0].x, tracePoints[0].y);

    tracePoints.forEach((p, index) => {
        ctx.fillStyle = '#FF3300';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
        if (index > 0) ctx.lineTo(p.x, p.y);
    });

    ctx.stroke();

    // Add "Target" label
    const last = tracePoints[tracePoints.length - 1];
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Outfit';
    ctx.fillText(' TARGET PATH', last.x + 10, last.y - 10);
}

function clearTrace() {
    ctx.clearRect(0, 0, traceCanvas.width, traceCanvas.height);
    tracePoints = [];
}

clearBtn.addEventListener('click', clearTrace);

// FLOATING OVERLAY (PiP) LOGIC
// This is the "secret" to having a tracer in the background!
pipBtn.addEventListener('click', async () => {
    try {
        const stream = traceCanvas.captureStream();
        pipVideo.srcObject = stream;
        await pipVideo.play();
        await pipVideo.requestPictureInPicture();
    } catch (error) {
        alert("Floating window not supported on this browser. Use 'Split Screen' on Android instead.");
    }
});

window.addEventListener('load', () => {
    resizeCanvas();
    // Auto-draw loop to sync canvas to Pip if it moves
    setInterval(drawTrace, 100);
});
