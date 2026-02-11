// Tab Switching Logic
const navLinks = document.querySelectorAll('.nav-links li');
const tabContents = document.querySelectorAll('.tab-content');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Remove active class from all links and tabs
        navLinks.forEach(l => l.classList.remove('active'));
        tabContents.forEach(t => t.classList.remove('active'));

        // Add active class to clicked link
        link.classList.add('active');

        // Show corresponding tab
        const sectionId = link.getAttribute('data-section');
        const targetTab = document.getElementById(sectionId);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    });
});

// Sensitivity Generator Logic
const genSensBtn = document.getElementById('gen-sens');
const resultsBox = document.getElementById('sens-results');

if (genSensBtn) {
    genSensBtn.addEventListener('click', () => {
        const currentSens = document.querySelector('input').value || 1.0;
        const activeChip = document.querySelector('.chip.active').innerText;

        let multiplier = 1.0;
        if (activeChip === 'Aggressive') multiplier = 1.25;
        if (activeChip === 'Tactical') multiplier = 0.95;
        if (activeChip === 'Sniper') multiplier = 0.75;

        const lowPow = (currentSens * multiplier * 0.8).toFixed(2);
        const midPow = (currentSens * multiplier * 1.1).toFixed(2);
        const highPow = (currentSens * multiplier * 1.5).toFixed(2);

        resultsBox.style.display = 'block';
        resultsBox.innerHTML = `
            <h4 style="margin-bottom: 0.5rem; color: #10B981">✨ Optimized Settings Created!</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9rem">
                <div>Standard: <b>${midPow}</b></div>
                <div>ADS Scope: <b>${lowPow}</b></div>
                <div>Gyroscope: <b>${highPow}</b></div>
                <div>Camera: <b>${currentSens}</b></div>
            </div>
            <p style="margin-top: 1rem; font-size: 0.8rem; color: #A1A1AA">Apply these in your BGMI settings for better control.</p>
        `;
    });
}

// Chip Logic
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => {
    chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
    });
});

// Crosshair Studio Logic
const chSize = document.getElementById('ch-size');
const chGap = document.getElementById('ch-gap');
const chThickness = document.getElementById('ch-thickness');
const chColor = document.getElementById('ch-color');
const chPreview = document.getElementById('crosshair-preview');
const chLines = document.querySelectorAll('.ch-line');
const chDot = document.querySelector('.ch-dot');

function updateCrosshair() {
    const size = chSize.value;
    const gap = chGap.value;
    const thickness = chThickness.value;
    const color = chColor.value;

    chLines.forEach(line => {
        line.style.backgroundColor = color;
        if (line.classList.contains('ch-up') || line.classList.contains('ch-down')) {
            line.style.width = `${thickness}px`;
            line.style.height = `${size}px`;
            line.style.left = `calc(50% - ${thickness / 2}px)`;
        } else {
            line.style.width = `${size}px`;
            line.style.height = `${thickness}px`;
            line.style.top = `calc(50% - ${thickness / 2}px)`;
        }
    });

    document.querySelector('.ch-up').style.bottom = `calc(50% + ${gap}px)`;
    document.querySelector('.ch-down').style.top = `calc(50% + ${gap}px)`;
    document.querySelector('.ch-left').style.right = `calc(50% + ${gap}px)`;
    document.querySelector('.ch-right').style.left = `calc(50% + ${gap}px)`;

    chDot.style.backgroundColor = color;
}

[chSize, chGap, chThickness, chColor].forEach(el => {
    if (el) el.addEventListener('input', updateCrosshair);
});

// Recoil Visualization Logic
const recoilViz = document.getElementById('recoil-viz');
let isShooting = false;
let bulletInterval;

if (recoilViz) {
    recoilViz.addEventListener('mousedown', () => {
        isShooting = true;
        startShooting();
    });

    window.addEventListener('mouseup', () => {
        isShooting = false;
        clearInterval(bulletInterval);
    });

    function startShooting() {
        let count = 0;
        bulletInterval = setInterval(() => {
            if (!isShooting || count > 30) {
                clearInterval(bulletInterval);
                return;
            }

            const bullet = document.createElement('div');
            bullet.className = 'recoil-bullet';

            // Simulate recoil (goes up and random side)
            const offsetX = (Math.random() - 0.5) * (count * 2);
            const offsetY = -(count * 8);

            bullet.style.left = `calc(50% + ${offsetX}px)`;
            bullet.style.top = `calc(50% + ${offsetY}px)`;

            recoilViz.appendChild(bullet);
            count++;

            // Auto-cleanup bullets after 2 seconds
            setTimeout(() => bullet.remove(), 2000);
        }, 100);
    }
}

// Map Selector Logic
const mapChips = document.querySelectorAll('.map-chip');
const mapItems = document.querySelectorAll('.map-item');

mapChips.forEach(chip => {
    chip.addEventListener('click', () => {
        // Remove active class from all chips and maps
        mapChips.forEach(c => c.classList.remove('active'));
        mapItems.forEach(m => m.classList.remove('active'));

        // Add active class to clicked chip
        chip.classList.add('active');

        // Show corresponding map
        const mapId = `map-${chip.getAttribute('data-map')}`;
        const targetMap = document.getElementById(mapId);
        if (targetMap) {
            targetMap.classList.add('active');
        }
    });
});

// Save & Load Logic
function saveSettings() {
    const settings = {
        crosshair: {
            size: chSize.value,
            gap: chGap.value,
            thickness: chThickness.value,
            color: chColor.value
        },
        activeMap: document.querySelector('.map-chip.active')?.getAttribute('data-map') || 'erangel',
        playstyle: document.querySelector('.chip.active')?.innerText || 'Aggressive'
    };
    localStorage.setItem('bgmi_pro_settings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('bgmi_pro_settings');
    if (!saved) return;

    const settings = JSON.parse(saved);

    // Apply Crosshair
    if (settings.crosshair) {
        chSize.value = settings.crosshair.size;
        chGap.value = settings.crosshair.gap;
        chThickness.value = settings.crosshair.thickness;
        chColor.value = settings.crosshair.color;
        updateCrosshair();
    }

    // Apply Map
    if (settings.activeMap) {
        const chip = document.querySelector(`.map-chip[data-map="${settings.activeMap}"]`);
        if (chip) chip.click();
    }

    // Apply Playstyle
    if (settings.playstyle) {
        const pChip = Array.from(document.querySelectorAll('.chip')).find(c => c.innerText === settings.playstyle);
        if (pChip) pChip.click();
    }
}

// Add event listeners to save settings when changed
[chSize, chGap, chThickness, chColor].forEach(el => {
    el.addEventListener('change', saveSettings);
});

mapChips.forEach(chip => {
    chip.addEventListener('click', saveSettings);
});

chips.forEach(chip => {
    chip.addEventListener('click', saveSettings);
});

// Simulate Loading
window.addEventListener('load', () => {
    console.log('BGMI Tactical Tool Initialized');
    updateCrosshair();
    loadSettings(); // Load everything back when browser opens
});
