import {
  hexToRgb,
  cssColorToRgb,
  rgbToHex,
  convertToHsl,
} from "lib/colors/conversions";
import { calculateContrastRatio } from "lib/colors/contrast";
import { modifyColors, shiftHue } from "lib/colors/change";

/**
 * Generates an array of similar colors based on the given colors.
 *
 * @param color1 {string} - The first hexadecimal color string, in the format "#RRGGBB".
 * @param color2 {string} - The second hexadecimal color string, in the format "#RRGGBB".
 * @returns {string[]} - An array of hexadecimal color strings, in the format "#RRGGBB".
 */
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

  // Convert the generated colors to HSL
  const hslColors = convertToHsl([gC1, gC2, gC3, gC4, gC5]);

  // Modify the saturation and lightness values of the HSL colors
  const adjustedColors = modifyColors(
    hslColors,
    [90, 85, 100, 100, 85], // Saturation values
    [88, 72, 65, 59, 53] // Lightness values
  );

  // Shift the hue values of the adjusted HSL colors
  const shiftedColors = shiftHue(adjustedColors);

  return [...adjustedColors, ...shiftedColors];
}
