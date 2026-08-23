const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Replace PowerShell ?? corruption
code = code.replace(/\?\? Healthy/g, '?? Healthy');
code = code.replace(/\?\? Critical/g, '?? Critical');
code = code.replace(/\?\? Connected/g, '?? Connected');
code = code.replace(/\?\? Unknown/g, '?? Unknown');
code = code.replace(/\? Offline/g, '?? Offline');
code = code.replace(/\?0/g, '?0');
code = code.replace(/\?\\\$\{\(paise/g, '?{(paise');

fs.writeFileSync('src/app/page.tsx', code, 'utf8');
