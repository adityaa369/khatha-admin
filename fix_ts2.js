const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, search, replace) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(search, replace);
        fs.writeFileSync(filePath, content);
    }
}

replaceInFile(path.join(__dirname, 'src', 'app', 'financial', 'page.tsx'), 'status="?? Balanced"', 'status="success"');
replaceInFile(path.join(__dirname, 'src', 'app', 'testlab', 'page.tsx'), 'simulateRun = (scenarioName)', 'simulateRun = (scenarioName: string)');

console.log("Remaining TS issues patched.");
