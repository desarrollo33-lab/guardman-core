import fs from 'fs';

let code = fs.readFileSync('src/migrations/20260317_051403_initial.ts', 'utf-8');

code = code.replace(/import {.*?}.*?\n/g, '');

const env = `
async function up({ db }) {
`;
code = code.replace(/export async function up.*\{/, env);

const footer = `
export async function down() {}
`;
code = code.replace(/export async function down[\s\S]*$/, '');

const wrapper = `
import fs from 'fs';

const db = {
  run: (sqlObj) => {
    console.log(sqlObj.text + '\\n');
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

` + code + `
up({ db }).catch(console.error);
`;

fs.writeFileSync('run-mig.js', wrapper);
