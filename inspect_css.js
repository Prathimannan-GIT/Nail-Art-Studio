const fs = require('fs');
const content = fs.readFileSync('assets/css/style.css', 'utf8');
const lines = content.split('\n');
console.log(`Total lines: ${lines.length}`);
for (let i = 1855; i < 1865; i++) {
    if (i < lines.length) {
        console.log(`Line ${i + 1}: ${JSON.stringify(lines[i])}`);
    }
}
