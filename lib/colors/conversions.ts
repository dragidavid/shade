/**
 * Converts a hexadecimal color string to an array of RGB values.
 *
 * @param hex {string} - The hexadecimal color string, in the format "#RRGGBB" or "#RGB".
 * @returns {number[]} - An array of RGB values [red, green, blue].
 */
export function hexToRgb(hex: string): number[] {
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

/**
 * Converts a CSS color string to an array of RGB values.
 *
 * @param cssColor {string} - The CSS color string, in the format "rgb(red, green, blue)" or "rgba(red, green, blue, alpha)".
 * @returns {number[]} - An array of RGB values [red, green, blue].
 */
export function cssColorToRgb(cssColor: string): number[] {
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

/**
 * Converts an array of RGB values to a hexadecimal color string.
 *
 * @param r {number} - The red value, between 0 and 255.
 * @param g {number} - The green value, between 0 and 255.
 * @param b {number} - The blue value, between 0 and 255.
 * @returns {string} - The hexadecimal color string, in the format "#RRGGBB".
 */
export function rgbToHex(r: number, g: number, b: number): string {
  // Ensure that the RGB values are within the valid range (0-255)
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
 * Converts a number to its corresponding hexadecimal string representation.
 *
 * @param c {number} - The number to convert, between 0 and 255.
 * @returns {string} - The hexadecimal string representation of the number.
 */
function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

/**
 * Converts an array of hexadecimal colors to their corresponding HSL values.
 *
 * @param colors {string[]} - An array of hexadecimal colors.
 * @returns {string[]} - An array of HSL colors in the format "hsl(hue, saturation, lightness)".
 */
export function convertToHsl(colors: string[]): string[] {
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

/**
 * Converts an HSL color to an HSLA color.
 *
 * @param color {string} - The HSL color in the format "hsl(hue, saturation, lightness)".
 * @param a {number} - The alpha value, between 0 and 1.
 * @returns {string} - The HSLA color in the format "hsla(hue, saturation, lightness, alpha)".
 */
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
