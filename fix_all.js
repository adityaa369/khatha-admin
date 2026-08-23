const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace ?? corruption
    content = content.replace(/\?\? Healthy/g, '?? Healthy');
    content = content.replace(/\?\? Attention/g, '?? Attention');
    content = content.replace(/\?\? Degraded/g, '?? Degraded');
    content = content.replace(/\?\? Critical/g, '?? Critical');
    content = content.replace(/\?\? Connected/g, '?? Connected');
    content = content.replace(/\?\? Unknown/g, '?? Unknown');
    content = content.replace(/\? Offline/g, '?? Offline');
    
    // Rupee symbol corruption (optional but good for consistency)
    content = content.replace(/\?0/g, '?0');
    
    fs.writeFileSync(file, content, 'utf8');
});
console.log('Fixed ' + files.length + ' files.');
