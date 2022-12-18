function calculateContrastRatio(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
): number {
  // Convert the RGB values to luminance values
  const l1 = calculateLuminance(r1, g1, b1);
  const l2 = calculateLuminance(r2, g2, b2);

  // Calculate the contrast ratio
  return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
}

function calculateLuminance(r: number, g: number, b: number): number {
  // Convert the RGB values to sRGB values
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Apply the sRGB to luminance conversion formula
  return (
    0.2126 * (r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4) +
    0.7152 * (g <= 0.03928 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4) +
    0.0722 * (b <= 0.03928 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4)
  );
}

function cssColorToRgb(cssColor: string): number[] {
  // Parse the color string to extract the R, G, B, and A values
  const matches = cssColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/
  );
  if (!matches) {
    throw new Error(`Invalid color string: ${cssColor}`);
  }

  // Convert the R, G, and B values to numbers and return them in an array
  return [
    parseInt(matches[1], 10),
    parseInt(matches[2], 10),
    parseInt(matches[3], 10),
  ];
}

function hexToRgb(hex: string): number[] {
  // Remove any leading "#" characters and any hyphens or periods
  hex = hex.replace(/^#/, "").replace(/[-.]/g, "");

  // Ensure that the string is a valid hexadecimal color by checking its length
  if (hex.length !== 3 && hex.length !== 6) {
    return [0, 0, 0];
  }

  // If the string is a 3-digit hexadecimal color, expand it to a 6-digit color
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Convert the hexadecimal string to RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return [r, g, b];
}

function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number): string {
  // Ensure that the RGB values are within the valid range (0-255)
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function generateColors(color1: string, color2: string): string[] {
  // Convert the hexadecimal strings to RGB values
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  const [rRef, gRef, bRef] = cssColorToRgb("rgba(0, 0, 0, 0.7)");

  // Calculate the average RGB values of the two colors
  const avgR = Math.floor((r1 + r2) / 2);
  const avgG = Math.floor((g1 + g2) / 2);
  const avgB = Math.floor((b1 + b2) / 2);

  // Generate the five similar colors by slightly adjusting the average RGB values
  let color3 = rgbToHex(avgR + 20, avgG - 20, avgB - 20);
  let color4 = rgbToHex(avgR - 20, avgG + 20, avgB + 20);
  let color5 = rgbToHex(avgR + 10, avgG + 10, avgB - 30);
  let color6 = rgbToHex(avgR - 30, avgG - 10, avgB + 10);
  let color7 = rgbToHex(avgR + 20, avgG - 10, avgB + 20);

  // Ensure that each of the generated colors has a good contrast ratio with the reference color
  const minContrastRatio = 4.5;
  [color3, color4, color5, color6, color7] = [
    color3,
    color4,
    color5,
    color6,
    color7,
  ].map((color) => {
    const [r, g, b] = hexToRgb(color);
    const contrastRatio = calculateContrastRatio(r, g, b, rRef, gRef, bRef);
    if (contrastRatio < minContrastRatio) {
      // Adjust the color to increase its contrast ratio
      const factor = (minContrastRatio + 0.05) / contrastRatio;
      return rgbToHex(
        Math.min(255, Math.max(0, Math.round(r * factor))),
        Math.min(255, Math.max(0, Math.round(g * factor))),
        Math.min(255, Math.max(0, Math.round(b * factor)))
      );
    } else {
      return color;
    }
  });

  return convertToHSL([color3, color4, color5, color6, color7]);
}

function convertToHSL(colors: string[]): string[] {
  const hslColors: string[] = [];

  for (const color of colors) {
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Normalize RGB values
    const rNormalized = r / 255;
    const gNormalized = g / 255;
    const bNormalized = b / 255;

    // Find minimum and maximum RGB values
    const max = Math.max(rNormalized, gNormalized, bNormalized);
    const min = Math.min(rNormalized, gNormalized, bNormalized);

    // Initialize HSL values
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    // Calculate saturation and hue
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h =
        max === rNormalized
          ? (gNormalized - bNormalized) / d +
            (gNormalized < bNormalized ? 6 : 0)
          : max === gNormalized
          ? (bNormalized - rNormalized) / d + 2
          : (rNormalized - gNormalized) / d + 4;
      h /= 6;
    }

    // Round HSL values and append to result array
    hslColors.push(
      `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
        l * 100
      )}%)`
    );
  }

  return modifyColors(hslColors, [70, 80, 90, 100, 30], [90, 80, 65, 50, 40]);
}

function modifyColors(
  hslColors: string[],
  saturationValues: number[],
  lightnessValues: number[]
): string[] {
  const modifiedHslColors: string[] = [];

  for (let i = 0; i < hslColors.length; i++) {
    const hslColor = hslColors[i];
    const lightnessValue = lightnessValues[i];
    const saturationValue = saturationValues[i];

    // Extract current hue, saturation, and lightness values from HSL color string
    const currentHue = hslColor.match(/hsl\((\d+), (\d+)%, (\d+)%\)/)![1];
    // const currentSaturation = hslColor.match(/hsl\((\d+), (\d+)%, (\d+)%\)/)![2];
    // const currentLightness = hslColor.match(/hsl\((\d+), (\d+)%, (\d+)%\)/)![3];

    // Generate random saturation value
    // const saturation = Math.floor(Math.random() * 20 + 80);

    // Create new HSL color string with modified lightness value
    const modifiedHslColor = `hsl(${currentHue}, ${saturationValue}%, ${lightnessValue}%)`;

    modifiedHslColors.push(modifiedHslColor);
  }

  return modifiedHslColors;
}
