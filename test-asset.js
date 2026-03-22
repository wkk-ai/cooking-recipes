const { getAssetPath } = require('./out-tsc/src/lib/utils') || {};
const ts = require('typescript');
const fs = require('fs');

const code = fs.readFileSync('src/lib/utils.ts', 'utf8');
const result = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.CommonJS }});
fs.writeFileSync('test-utils.js', result.outputText);
const { getAssetPath: gap } = require('./test-utils.js');
console.log("Output:", gap("/images/recipes/dadinho_tapioca.jpg"));
