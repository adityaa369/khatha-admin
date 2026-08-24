const fs = require('fs');
let page = fs.readFileSync('src/app/security/page.tsx', 'utf8');

page = page.replace(/status="🟢 Protected"/g, 'status="🟢 Healthy"');
page = page.replace(/status=\{overview\?\.otpReplays > 0 \? "🔴 Active Threats" : "🟢 Healthy"\}/g, 'status={overview?.otpReplays > 0 ? "🔴 Critical" : "🟢 Healthy"}');
page = page.replace(/status=\{overview\?\.rateLimits > 0 \? "🟡 Warnings" : "🟢 Healthy"\}/g, 'status={overview?.rateLimits > 0 ? "🟡 Attention" : "🟢 Healthy"}');
page = page.replace(/status=\{overview\?\.criticalIncidents > 0 \? "🔴 Critical" : "🟢 Clear"\}/g, 'status={overview?.criticalIncidents > 0 ? "🔴 Critical" : "🟢 Healthy"}');

fs.writeFileSync('src/app/security/page.tsx', page);
console.log("Replaced!");
