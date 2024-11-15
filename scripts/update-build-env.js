const fs = require('fs');
const path = require('path');

const env = process.argv[2];
const timestamp = new Date()
  .toISOString()
  .replace(/[^0-9]/g, '')
  .slice(0, 14);
const version = timestamp.slice(2, 12);

updateOrAddEnvVariable('.env', 'TIMESTAMP', timestamp);
updateOrAddEnvVariable('.env', 'VERSION', version);
updateOrAddEnvVariable('.env.production', 'TIMESTAMP', timestamp);
updateOrAddEnvVariable('.env.production', 'VITE_VERSION', version);

updateOrAddEnvVariable('.env', 'DEPLOY_ENV', env);

function updateOrAddEnvVariable(envFile, key, value) {
  const envPath = path.join(__dirname, '..', envFile); // Adjust the path to your .env file
  let envContents = fs.readFileSync(envPath, 'utf-8');
  let lines = envContents.split('\n');

  let found = false;
  lines = lines.map(line => {
    const [currentKey] = line.split('=');
    if (currentKey === key) {
      found = true;
      return `${key}=${value}`;
    }
    return line;
  });

  if (!found) {
    lines.push(`${key}=${value}`);
  }

  // Filter out any empty lines
  lines = lines.filter(line => line.trim() !== '');

  fs.writeFileSync(envPath, lines.join('\n'));
}
