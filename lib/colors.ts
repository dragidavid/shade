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
  let gC1 = rgbToHex(avgR + 20, avgG - 20, avgB - 20);
  let gC2 = rgbToHex(avgR - 20, avgG + 20, avgB + 20);
  let gC3 = rgbToHex(avgR + 10, avgG + 10, avgB - 30);
  let gC4 = rgbToHex(avgR - 30, avgG - 10, avgB + 10);
  let gC5 = rgbToHex(avgR + 20, avgG - 10, avgB + 20);

  // generate a whole number between -30 and 30
  const random = Math.floor(Math.random() * 61) - 30;

  // Ensure that each of the generated colors has a good contrast ratio with the reference color
  const minContrastRatio = 7;
  [gC1, gC2, gC3, gC4, gC5] = [gC1, gC2, gC3, gC4, gC5].map((color) => {
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

  // Convert the generated colors to HSL and adjust their saturation and lightness values
  const hslColors = convertToHSL([gC1, gC2, gC3, gC4, gC5]);
  const adjustedColors = modifyColors(
    hslColors,
    [90, 85, 100, 100, 85], // saturation values
    [87, 70, 63, 58, 45] // lightness values
  );
  const shiftedColors = shiftHue(adjustedColors);

  return [...adjustedColors, ...shiftedColors];
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

  return hslColors;
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

    modifiedHslColors.push(
      `hsl(${currentHue}, ${saturationValue}%, ${lightnessValue}%)`
    );
  }

  return modifiedHslColors;
}

function shiftHue(colors: string[]): string[] {
  const shiftedColors = [];

  for (const degree of [120, 240]) {
    for (const color of colors) {
      // Parse the color string to get the hue, saturation, and lightness values
      const match = color.match(
        /hsl\((\d+), (\d+)%, (\d+)%\)/
      ) as RegExpMatchArray;
      const hue = match[1];
      const saturation = match[2];
      const lightness = match[3];

      const shiftedHue = (parseInt(hue, 10) + degree) % 360;

      const shiftedColor = `hsl(${shiftedHue}, ${saturation}%, ${lightness}%)`;

      shiftedColors.push(shiftedColor);
    }
  }

  return shiftedColors;
}

export function hslToHsla(color: string, a: number): string {
  // Extract the hue, saturation, and lightness values from the HSL color string
  const values = color.match(/^hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)$/);
  if (!values) {
    throw new Error(`Invalid HSL color: ${color}`);
  }
  const h = parseInt(values[1], 10);
  const s = parseInt(values[2], 10);
  const l = parseInt(values[3], 10);

  // Make sure the alpha value is between 0 and 1
  a = Math.max(0, Math.min(1, a));

  // Return the HSLA color as a string
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

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
