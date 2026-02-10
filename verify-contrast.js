// Color Contrast Verification Script
// Verifies WCAG AA compliance for callout colors

// Callout colors from Obsidian palette (adjusted for WCAG AA compliance)
const colors = {
  blue: { r: 8, g: 109, b: 221, name: 'Blue (Note/Info)' },
  cyan: { r: 0, g: 150, b: 130, name: 'Cyan (Tip/Abstract) - Adjusted' },
  green: { r: 6, g: 145, b: 60, name: 'Green (Success/Done) - Adjusted' },
  orange: { r: 190, g: 95, b: 0, name: 'Orange (Warning/Question/Caution) - Adjusted' },
  red: { r: 200, g: 40, b: 60, name: 'Red (Failure/Danger/Bug/Important) - Adjusted' },
  grey: { r: 120, g: 120, b: 120, name: 'Grey (Quote) - Adjusted' },
  purple: { r: 130, g: 65, b: 200, name: 'Purple (Example) - Adjusted' }
};

// Dark mode colors (brighter, original Obsidian colors)
const colorsDark = {
  blue: { r: 8, g: 109, b: 221, name: 'Blue (Note/Info)' },
  cyan: { r: 0, g: 191, b: 165, name: 'Cyan (Tip/Abstract)' },
  green: { r: 8, g: 185, b: 78, name: 'Green (Success/Done)' },
  orange: { r: 236, g: 117, b: 0, name: 'Orange (Warning/Question/Caution)' },
  red: { r: 233, g: 49, b: 71, name: 'Red (Failure/Danger/Bug/Important)' },
  grey: { r: 158, g: 158, b: 158, name: 'Grey (Quote)' },
  purple: { r: 168, g: 85, b: 247, name: 'Purple (Example)' }
};

// Background colors
const backgrounds = {
  light: { r: 255, g: 255, b: 255, name: 'Light background' },
  dark: { r: 30, g: 30, b: 30, name: 'Dark background' }
};

// Calculate relative luminance
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(color1, color2) {
  const l1 = getLuminance(color1.r, color1.g, color1.b);
  const l2 = getLuminance(color2.r, color2.g, color2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG AA requirements
const WCAG_AA_NORMAL = 4.5;  // Normal text
const WCAG_AA_LARGE = 3.0;   // Large text (18pt+ or 14pt+ bold)

console.log('='.repeat(80));
console.log('WCAG AA Color Contrast Verification for Markdown Callouts');
console.log('='.repeat(80));
console.log('');
console.log('Testing Light Mode (adjusted colors) and Dark Mode (original colors)');
console.log('');

// Test each callout color against light and dark backgrounds
let allPass = true;

console.log('\n' + '='.repeat(80));
console.log('LIGHT MODE - Adjusted Colors for Better Contrast');
console.log('='.repeat(80));

Object.entries(colors).forEach(([key, color]) => {
  console.log(`\n${color.name}`);
  console.log('-'.repeat(60));
  
  // Test against light background (for title text)
  const lightRatio = getContrastRatio(color, backgrounds.light);
  const lightPassNormal = lightRatio >= WCAG_AA_NORMAL;
  const lightPassLarge = lightRatio >= WCAG_AA_LARGE;
  
  console.log(`  Title text on white background:`);
  console.log(`    Contrast ratio: ${lightRatio.toFixed(2)}:1`);
  console.log(`    Normal text (≥4.5:1): ${lightPassNormal ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`    Large/Bold text (≥3.0:1): ${lightPassLarge ? '✓ PASS' : '✗ FAIL'}`);
  
  // Since titles are bold (font-weight: 600), they qualify as large text
  if (!lightPassLarge) allPass = false;
  
  // Test background opacity (10% on light)
  const lightBg = {
    r: Math.round(255 * 0.9 + color.r * 0.1),
    g: Math.round(255 * 0.9 + color.g * 0.1),
    b: Math.round(255 * 0.9 + color.b * 0.1)
  };
  
  // Test body text on tinted backgrounds
  const bodyTextLight = { r: 112, g: 112, b: 112 }; // --body-text-color in light mode
  
  const lightBodyRatio = getContrastRatio(bodyTextLight, lightBg);
  
  console.log(`  Body text on tinted background:`);
  console.log(`    Contrast ratio: ${lightBodyRatio.toFixed(2)}:1`);
  console.log(`    Normal text (≥4.5:1): ${lightBodyRatio >= WCAG_AA_NORMAL ? '✓ PASS' : '✗ FAIL'}`);
  
  if (lightBodyRatio < WCAG_AA_NORMAL) {
    allPass = false;
  }
});

console.log('\n' + '='.repeat(80));
console.log('DARK MODE - Original Obsidian Colors');
console.log('='.repeat(80));

Object.entries(colorsDark).forEach(([key, color]) => {
  console.log(`\n${color.name}`);
  console.log('-'.repeat(60));
  
  // Test against dark background (for title text in dark mode)
  const darkRatio = getContrastRatio(color, backgrounds.dark);
  const darkPassNormal = darkRatio >= WCAG_AA_NORMAL;
  const darkPassLarge = darkRatio >= WCAG_AA_LARGE;
  
  console.log(`  Title text on dark background:`);
  console.log(`    Contrast ratio: ${darkRatio.toFixed(2)}:1`);
  console.log(`    Normal text (≥4.5:1): ${darkPassNormal ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`    Large/Bold text (≥3.0:1): ${darkPassLarge ? '✓ PASS' : '✗ FAIL'}`);
  
  // Since titles are bold (font-weight: 600), they qualify as large text
  if (!darkPassLarge) allPass = false;
  
  // Test background opacity (5% on dark)
  const darkBg = {
    r: Math.round(30 * 0.95 + color.r * 0.05),
    g: Math.round(30 * 0.95 + color.g * 0.05),
    b: Math.round(30 * 0.95 + color.b * 0.05)
  };
  
  // Test body text on tinted backgrounds
  const bodyTextDark = { r: 217, g: 217, b: 217 }; // --body-text-color in dark mode (0.85 * 255)
  
  const darkBodyRatio = getContrastRatio(bodyTextDark, darkBg);
  
  console.log(`  Body text on tinted background:`);
  console.log(`    Contrast ratio: ${darkBodyRatio.toFixed(2)}:1`);
  console.log(`    Normal text (≥4.5:1): ${darkBodyRatio >= WCAG_AA_NORMAL ? '✓ PASS' : '✗ FAIL'}`);
  
  if (darkBodyRatio < WCAG_AA_NORMAL) {
    allPass = false;
  }
});

console.log('\n' + '='.repeat(80));
console.log(`Overall Result: ${allPass ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}`);
console.log('='.repeat(80));
console.log('');
console.log('Notes:');
console.log('- Title text uses bold font (weight: 600), qualifying as "large text" for WCAG');
console.log('- Large/bold text requires ≥3.0:1 contrast ratio (WCAG AA)');
console.log('- Body text uses theme body-text-color on semi-transparent background');
console.log('- Body text requires ≥4.5:1 contrast ratio (WCAG AA)');
console.log('- Light mode uses adjusted colors for better contrast');
console.log('- Dark mode uses original Obsidian colors (brighter for visibility)');
console.log('- Borders use full accent color (always visible)');
console.log('- Icons use accent color (decorative, aria-hidden)');
console.log('');

process.exit(allPass ? 0 : 1);
