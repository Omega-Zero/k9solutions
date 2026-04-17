const fs = require('fs');
const path = require('path');

// Create dist directories if they don't exist
const dirsToCreate = [
  'dist',
  'dist/assets',
  'dist/assets/js',
  'dist/assets/images'
];

dirsToCreate.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy HTML pages from src/pages to dist
const pagesDir = path.join('src', 'pages');
fs.readdirSync(pagesDir).forEach(file => {
  if (file.endsWith('.html')) {
    const src = path.join(pagesDir, file);
    const dest = path.join('dist', file);
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file}`);
  }
});

// Copy JS files from src/assets/js to dist/assets/js
const jsDir = path.join('src', 'assets', 'js');
if (fs.existsSync(jsDir)) {
  fs.readdirSync(jsDir).forEach(file => {
    if (file.endsWith('.js')) {
      const src = path.join(jsDir, file);
      const dest = path.join('dist', 'assets', 'js', file);
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file}`);
    }
  });
}

// Copy images from src/assets/images to dist/assets/images
const imagesDir = path.join('src', 'assets', 'images');
if (fs.existsSync(imagesDir)) {
  fs.readdirSync(imagesDir).forEach(file => {
    const src = path.join(imagesDir, file);
    const dest = path.join('dist', 'assets', 'images', file);
    fs.copyFileSync(src, dest);
    console.log(`Copied image: ${file}`);
  });
}

// Copy components from src/components to dist/components
const componentsDir = path.join('src', 'components');
if (!fs.existsSync(path.join('dist', 'components'))) {
  fs.mkdirSync(path.join('dist', 'components'), { recursive: true });
}
if (fs.existsSync(componentsDir)) {
  fs.readdirSync(componentsDir).forEach(file => {
    if (file.endsWith('.html')) {
      const src = path.join(componentsDir, file);
      const dest = path.join('dist', 'components', file);
      fs.copyFileSync(src, dest);
      console.log(`Copied component: ${file}`);
    }
  });
}

console.log('Build complete!');
