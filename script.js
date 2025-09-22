const paletteContainer = document.getElementById('palette');
const generateBtn = document.getElementById('generateBtn');
const colorInput = document.getElementById('colorInput');

// Convert HSL to HEX
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return `#${[f(0), f(8), f(4)].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

// Convert HEX to HSL
function hexToHsl(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Parse HSL string
function parseHslString(hslStr) {
  const match = hslStr.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/i);
  if (!match) return null;
  return {
    h: parseInt(match[1]),
    s: parseInt(match[2]),
    l: parseInt(match[3])
  };
}

// Generate harmonious colors
function getHarmoniousColors(base) {
  const { h, s, l } = base;
  return [
    { label: 'Base', h, s, l },
    { label: 'Analogous', h: (h + 30) % 360, s, l },
    { label: 'Complementary', h: (h + 180) % 360, s, l },
    { label: 'Triadic', h: (h + 120) % 360, s, l },
    { label: 'Monochromatic', h, s, l: (l + 20) % 100 }
  ];
}

// Render colors
function renderPalette() {
  const input = colorInput.value.trim();
  let base;

  if (input.startsWith('#')) {
    base = hexToHsl(input);
  } else if (input.startsWith('hsl')) {
    base = parseHslString(input);
  }

  if (!base || isNaN(base.h)) {
    base = {
      h: Math.floor(Math.random() * 360),
      s: 70,
      l: 60
    };
  }

  const colors = getHarmoniousColors(base);
  paletteContainer.innerHTML = '';

  colors.forEach(({ label, h, s, l }) => {
    const hsl = `hsl(${h}, ${s}%, ${l}%)`;
    const hex = hslToHex(h, s, l).toUpperCase();

    const block = document.createElement('div');
    block.className = 'color-block';
    block.style.backgroundColor = hsl;

    const labelEl = document.createElement('div');
    labelEl.className = 'color-label';
    labelEl.textContent = label;

    const hexEl = document.createElement('div');
    hexEl.className = 'color-hex';
    hexEl.textContent = hex;

    block.appendChild(labelEl);
    block.appendChild(hexEl);

    block.addEventListener('click', () => {
      navigator.clipboard.writeText(hex).then(() => {
        hexEl.textContent = 'Copied!';
        setTimeout(() => {
          hexEl.textContent = hex;
        }, 1000);
      });
    });

    paletteContainer.appendChild(block);
  });
}

// Initial render
renderPalette();
generateBtn.addEventListener('click', renderPalette);
