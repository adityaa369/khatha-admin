const fs = require('fs');
const path = require('path');

// Helper to replace content
function replaceInFile(filePath, replacements) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        for (const [search, replace] of replacements) {
            content = content.replace(search, replace);
        }
        fs.writeFileSync(filePath, content);
    }
}

// 1. fix adversarial/page.tsx
replaceInFile(path.join(__dirname, 'src', 'app', 'adversarial', 'page.tsx'), [
    ['useState(null)', 'useState<any>(null)'],
    ['map((cat, idx)', 'map((cat: any, idx: number)'],
    ['map((cat)', 'map((cat: any)'],
    ['map(cat =>', 'map((cat: any) =>']
]);

// 2. fix readiness/page.tsx
replaceInFile(path.join(__dirname, 'src', 'app', 'readiness', 'page.tsx'), [
    ['useState(null)', 'useState<any>(null)'],
    ['map((gate, idx)', 'map((gate: any, idx: number)']
]);

// 3. fix testlab/page.tsx
replaceInFile(path.join(__dirname, 'src', 'app', 'testlab', 'page.tsx'), [
    ['useState(null)', 'useState<any>(null)'],
    ['runScenario = (scenarioName)', 'runScenario = (scenarioName: string)']
]);

// 4. fix financial/page.tsx
replaceInFile(path.join(__dirname, 'src', 'app', 'financial', 'page.tsx'), [
    ['level="?? Balanced"', 'level="success"'],
    ['level="?? Balanced"', 'level="success"'] // in case there are multiple
]);

console.log("TS issues patched.");
