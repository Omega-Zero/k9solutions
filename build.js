const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    fs.readdirSync(src).forEach(entry => {
      copyRecursiveSync(path.join(src, entry), path.join(dest, entry));
    });
    return;
  }

  fs.copyFileSync(src, dest);
}

// Create dist directories if they don't exist
const dirsToCreate = [
  'dist',
  'dist/assets',
  'dist/assets/js',
  'dist/assets/images',
  'dist/assets/videos'
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
    copyRecursiveSync(src, dest);
    console.log(`Copied image asset: ${file}`);
  });
}

// Copy videos from src/assets/videos to dist/assets/videos
const videosDir = path.join('src', 'assets', 'videos');
if (fs.existsSync(videosDir)) {
  fs.readdirSync(videosDir).forEach(file => {
    const src = path.join(videosDir, file);
    const dest = path.join('dist', 'assets', 'videos', file);
    copyRecursiveSync(src, dest);
    console.log(`Copied video asset: ${file}`);
  });
}

// Copy Font Awesome from src/assets/fontawesome to dist/assets/fontawesome
const fontawesomeDir = path.join('src', 'assets', 'fontawesome');
if (fs.existsSync(fontawesomeDir)) {
  copyRecursiveSync(fontawesomeDir, path.join('dist', 'assets', 'fontawesome'));
  console.log('Copied fontawesome assets');
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

// Copy sitemap.xml and robots.txt to dist root
['sitemap.xml', 'robots.txt'].forEach(file => {
  const src = path.join('src', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join('dist', file));
    console.log(`Copied ${file}`);
  }
});

// Create .nojekyll file for GitHub Pages
fs.writeFileSync(path.join('dist', '.nojekyll'), '');
console.log('Created .nojekyll file');

console.log('Build complete!');

