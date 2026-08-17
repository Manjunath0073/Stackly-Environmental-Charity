const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Stackly Environmental Charity/assets/images';
const tmpDir = 'C:/Users/Acer/AppData/Local/Temp/opencode/imgcompress';
const MAX_SIZE = 95 * 1024;

if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.webp'));

(async () => {
  let count = 0;
  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const tmpPath = path.join(tmpDir, file);
    try {
      const data = fs.readFileSync(srcPath);
      if (data.length <= MAX_SIZE) continue;

      fs.writeFileSync(tmpPath, data);
      let buffer = await sharp(tmpPath).webp({ quality: 75 }).toBuffer();
      if (buffer.length > MAX_SIZE) {
        buffer = await sharp(tmpPath).webp({ quality: 60 }).toBuffer();
      }
      if (buffer.length > MAX_SIZE) {
        buffer = await sharp(tmpPath).webp({ quality: 45 }).toBuffer();
      }

      if (buffer.length < data.length) {
        fs.writeFileSync(srcPath, buffer);
        const saved = ((1 - buffer.length / data.length) * 100).toFixed(1);
        console.log(`${file}: ${(data.length/1024).toFixed(0)}kb -> ${(buffer.length/1024).toFixed(0)}kb (${saved}% saved)`);
        count++;
      }
    } catch (e) {
      console.log(`SKIP: ${file} - ${e.message}`);
    }
  }
  console.log(`\nDone. ${count} images compressed.`);
})();
