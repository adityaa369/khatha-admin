const fs = require('fs');
const path = require('path');

// 1. Fix src/app/adversarial/page.tsx
const advPath = path.join(__dirname, 'src', 'app', 'adversarial', 'page.tsx');
if (fs.existsSync(advPath)) {
    let content = fs.readFileSync(advPath, 'utf8');
    if (!content.includes('"use client"')) {
        content = '"use client";\n' + content;
    }
    // Replace unescaped > in JSX
    content = content.replace(/> Bypassing/g, '&gt; Bypassing');
    content = content.replace(/> Modifying/g, '&gt; Modifying');
    content = content.replace(/> Injecting/g, '&gt; Injecting');
    content = content.replace(/> Attempting/g, '&gt; Attempting');
    fs.writeFileSync(advPath, content);
}

// 2. Fix src/app/readiness/page.tsx
const readPath = path.join(__dirname, 'src', 'app', 'readiness', 'page.tsx');
if (fs.existsSync(readPath)) {
    let content = fs.readFileSync(readPath, 'utf8');
    if (!content.includes('"use client"')) {
        content = '"use client";\n' + content;
    }
    fs.writeFileSync(readPath, content);
}

// 3. Fix src/app/testlab/page.tsx
const testlabPath = path.join(__dirname, 'src', 'app', 'testlab', 'page.tsx');
if (fs.existsSync(testlabPath)) {
    let content = fs.readFileSync(testlabPath, 'utf8');
    if (!content.includes('"use client"')) {
        content = '"use client";\n' + content;
    }
    fs.writeFileSync(testlabPath, content);
}

console.log("Files fixed.");
