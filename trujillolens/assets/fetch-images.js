import fs from 'node:fs';
import path from 'node:path';

const images = {
  'hero_eyewear.jpg': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1400&q=80',
  'sunglasses_aviator.jpg': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
  'sunglasses_wayfarer.jpg': 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
  'optics_acetate.jpg': 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
  'sunglasses_cateye.jpg': 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80',
  'optics_titanium.jpg': 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',
  'sunglasses_sport.jpg': 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80',
  'clinic_optometry.jpg': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
  'contact_lenses.jpg': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
  'trujillo_city.jpg': 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1000&q=80',
  'optometrist_doctor.jpg': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'
};

const outputDir = path.resolve('assets/images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

for (const [filename, url] of Object.entries(images)) {
  try {
    console.log(`Downloading ${filename}...`);
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Warning: failed HTTP status ${res.status} for ${filename}`);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(outputDir, filename), buffer);
    console.log(`✓ Saved ${filename} (${buffer.length} bytes)`);
  } catch (err) {
    console.error(`Error downloading ${filename}:`, err.message);
  }
}
console.log('Finished downloading assets!');
