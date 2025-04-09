const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Paths
const svgPath = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Ensure the SVG file exists
if (!fs.existsSync(svgPath)) {
  console.error('SVG icon file not found at:', svgPath);
  process.exit(1);
}

// Read the SVG file
const svgBuffer = fs.readFileSync(svgPath);

// Define the sizes to generate
const sizes = [192, 512];

// Generate PNG files for each size
async function generateIcons() {
  try {
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated: ${outputPath}`);
    }
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

// Run the icon generation
generateIcons(); 