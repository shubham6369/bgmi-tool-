const mapChips = document.querySelectorAll('.chip');
const mapItems = document.querySelectorAll('.map-item');
const traceCanvas = document.getElementById('trace-canvas');
const ctx = traceCanvas.getContext('2d');
const clearBtn = document.getElementById('clear-trace');
const pipVideo = document.getElementById('pip-video');
const pipBtn = document.getElementById('launch-overlay');

let tracePoints = [];

// Initialize Canvas
function resizeCanvas() {
    traceCanvas.width = window.innerWidth;
    traceCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Map Switching
mapChips.forEach(chip => {
    chip.addEventListener('click', () => {
        mapChips.forEach(c => c.classList.remove('active'));
        mapItems.forEach(m => m.classList.remove('active'));
        chip.classList.add('active');
        document.getElementById(`map-${chip.getAttribute('data-map')}`).classList.add('active');
        tracePoints = [];
        ctx.clearRect(0, 0, traceCanvas.width, traceCanvas.height);
    });
});

// Tracing Logic
traceCanvas.addEventListener('click', (e) => {
    tracePoints.push({ x: e.clientX, y: e.clientY });
    drawTrace();
});

function drawTrace() {
    ctx.clearRect(0, 0, traceCanvas.width, traceCanvas.height);
    if (tracePoints.length === 0) return;

    ctx.strokeStyle = '#FF9900';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.setLineDash([10, 5]);

    ctx.beginPath();
    ctx.moveTo(tracePoints[0].x, tracePoints[0].y);

    tracePoints.forEach((p, index) => {
        // Draw larger dot for touch targets
        ctx.fillStyle = '#FF9900';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
        if (index > 0) ctx.lineTo(p.x, p.y);
    });

    ctx.stroke();

    // Minimal Label
    const last = tracePoints[tracePoints.length - 1];
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Outfit';
    ctx.fillText(' TARGET', last.x + 15, last.y - 15);
}

clearBtn.addEventListener('click', () => {
    tracePoints = [];
    ctx.clearRect(0, 0, traceCanvas.width, traceCanvas.height);
});

// Background / Floating Overlay
pipBtn.addEventListener('click', async () => {
    try {
        const stream = traceCanvas.captureStream();
        pipVideo.srcObject = stream;
        await pipVideo.play();
        await pipVideo.requestPictureInPicture();
    } catch (e) {
        alert("Floating window failed. Use Split Screen instead.");
    }
});

window.addEventListener('load', () => {
    resizeCanvas();
    setInterval(drawTrace, 100);
});
