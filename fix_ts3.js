const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'financial', 'page.tsx');
if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // We previously replaced it with "success", let's replace it with "?? Healthy"
    content = content.replace('status="success"', 'status="?? Healthy"');
    // Just in case it's still '?? Balanced' or '?? Balanced' in some weird encoding
    content = content.replace('status="?? Balanced"', 'status="?? Healthy"');
    content = content.replace('status="?? Balanced"', 'status="?? Healthy"');
    fs.writeFileSync(filePath, content);
}

console.log("Replaced with ?? Healthy.");
