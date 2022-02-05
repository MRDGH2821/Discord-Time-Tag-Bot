const { exec } = require('child_process');
const crypto = require('crypto');
const fs = require('fs/promises'),
  packagePath = './package.json',
  statPath = './deploy-stats.txt';

async function hashCalc(path) {
  const fileBuffer = await fs.readFile(path),
    hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  // eslint-disable-next-line one-var
  const hex = hashSum.digest('hex');
  console.log(`Hash of ${path} :\n`, hex);
  return hex;
}

async function compare(oldPath, pkgPath) {
  let execFlag = false;
  const newHash = await hashCalc(pkgPath);
  await fs
    .readFile(oldPath, 'utf-8')
    .then((hash) => {
      console.log(`Hash stored in ${oldPath} :\n`, hash);
      if (hash === newHash) {
        console.log('\nHashes are same, no need to deploy commands.');
      }
      else {
        execFlag = true;
      }
    })
    .catch(() => {
      execFlag = true;
    })
    .finally(() => {
      if (execFlag) {
        exec('node deploy-commands.js', (error, stdout, stderr) => {
          if (error) {
            return error;
          }
          else if (stderr) {
            return stderr;
          }
          console.log(stdout);
          return stdout;
        });
      }
      fs.writeFile(oldPath, newHash).then(console.log('\nUpdated with new hash!'));
    });
}

compare(statPath, packagePath);
