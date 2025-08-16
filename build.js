const fs = require('fs');
const path = require('path');

const tampermonkeyHeadPath = path.join(__dirname, 'tampermonkeyHead.js');
const scriptPath = path.join(__dirname, 'dist', 'script.js');
const outputPath = path.join(__dirname, 'tampermonkeyScript.js');

try {
  const tampermonkeyHead = fs.readFileSync(tampermonkeyHeadPath, 'utf8');
  const script = fs.readFileSync(scriptPath, 'utf8');

  const output = tampermonkeyHead + '\n' + script;

  fs.writeFileSync(outputPath, output);

  console.log('tampermonkeyScript.js built successfully!');
} catch (error) {
  console.error('Error building tampermonkeyScript.js:', error);
  if (error.code === 'ENOENT') {
    console.error(
      'Please ensure that both tampermonkeyHead.js and dist/script.js exist before running the build script.',
    );
  }
  process.exit(1);
}
