/**
 * Calculates the contrast ratio between two RGB colors.
 *
 * @param r1 {number} - The red component of the first color, between 0 and 255.
 * @param g1 {number} - The green component of the first color, between 0 and 255.
 * @param b1 {number} - The blue component of the first color, between 0 and 255.
 * @param r2 {number} - The red component of the second color, between 0 and 255.
 * @param g2 {number} - The green component of the second color, between 0 and 255.
 * @param b2 {number} - The blue component of the second color, between 0 and 255.
 * @returns {number} - The contrast ratio between the two colors.
 */
export function calculateContrastRatio(
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

/**
 * Calculates the luminance value of an RGB color.
 *
 * @param r {number} - The red component of the color, between 0 and 255.
 * @param g {number} - The green component of the color, between 0 and 255.
 * @param b {number} - The blue component of the color, between 0 and 255.
 * @returns {number} - The luminance value of the color.
 */
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
