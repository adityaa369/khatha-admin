const fs = require('fs');
const path = require('path');
let content = fs.readFileSync(path.join(__dirname, 'src/app/page.tsx'), 'utf8');

// Fix Unicode corruption
content = content.replace(/\?\? Healthy/g, '🟢 Healthy');
content = content.replace(/\?\? Connected/g, '🟢 Connected');
content = content.replace(/\?\? Critical/g, '🔴 Critical');
content = content.replace(/\? Offline/g, '🔴 Offline');
content = content.replace(/\?\? OFF/g, '🟢 OFF');
content = content.replace(/\?\? ON/g, '🔴 ON');
content = content.replace(/\?0/g, '₹0');
content = content.replace(/return \\\\?\\\$\{\(paise \/ 100\)\.toLocaleString\('en-IN'\)\}\\\/g, 'return ₹');

fs.writeFileSync(path.join(__dirname, 'src/app/page.tsx'), content, 'utf8');
