const fs = require('fs');
const path = 'assets/css/style.css';

try {
    // Create backup
    fs.copyFileSync(path, path + '.bak');
    console.log('Backup created.');

    let content = fs.readFileSync(path, 'utf8');
    const lines = content.split(/\r?\n/);

    // Identify where the corruption starts.
    // Based on inspection, line 1856 (index 1855) is "}". Line 1857 is empty. Line 1858 is garbage.
    // Let's find the specific corrupted line start to be safe.
    let corruptionIndex = -1;
    for (let i = 1850; i < lines.length; i++) {
        // Check for the null bytes or the spaced out comment
        if (lines[i].includes('\u0000') || lines[i].includes('/ *')) {
            corruptionIndex = i;
            break;
        }
    }

    if (corruptionIndex === -1) {
        console.log("Could not find start of corruption. Exiting.");
        process.exit(0);
    }

    console.log(`Corruption detected starting at line ${corruptionIndex + 1}`);

    const goodPart = lines.slice(0, corruptionIndex).join('\n');
    let badPart = lines.slice(corruptionIndex).join('\n');

    // 1. Remove null bytes
    let cleaned = badPart.replace(/\u0000/g, '');

    // 2. Fix spaced out text heuristic
    // We assume the pattern is "char + space".
    // We repeatedly replace "char + space" with "char". 
    // But we need to be careful. The pattern seems to apply to *every* character.
    // Let's try regular expression replacement.
    // Only apply if it indeed looks spaced out.
    if (cleaned.includes(' / * ') || cleaned.includes(' d i s p l a y ')) {
        console.log("Collapsing spaced text...");
        // This regex matches any character followed by a space, global.
        // It keeps the character, drops the space.
        cleaned = cleaned.replace(/(.) /g, '$1');
    }

    // 3. Fix double spaces or other artifacts if necessary?
    // The previous step might turn "  " (double space) into " " (single space), which is correct for original single spaces.

    // There appears to be one catch: what if the last character of a line didn't have a space?
    // And indentation?
    // "         / * ..." (9 spaces?) -> "     /* ..." (5 spaces?)
    // Indentation might shrink, but that's fine for CSS. 

    const newContent = goodPart + '\n' + cleaned;
    fs.writeFileSync(path, newContent, 'utf8');
    console.log("File repaired and saved.");

} catch (err) {
    console.error("Error:", err);
}
