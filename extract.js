const fs = require('fs');
let code = fs.readFileSync('src/migrations/20260317_051403_initial.ts', 'utf-8');

// Replace standard imports
code = code.replace(/import {.*?}.*?\n/g, '');

// Create dummy environment
const env = `
async function up({ db }) {
`;
code = code.replace(/export async function up.*\{/, env);

const footer = `
export async function down() {}
`;
code = code.replace(/export async function down[\s\S]*$/, '');

// Add execution wrapper
code = `
const db = {
  run: (sqlObj) => {
    console.log(sqlObj.text + ';\\n');
  }
};
function sql(strings, ...values) {
  let str = '';
  for(let i=0; i<strings.length; i++) {
    str += strings[i];
    if (i < values.length) str += values[i];
  }
  return { text: str };
}

${code}

up({ db }).catch(console.error);
`;

fs.writeFileSync('run-mig.js', code);
