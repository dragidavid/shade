/**
 * Modifies the saturation and lightness values of an array of HSL colors.
 *
 * @param hslColors {string[]} - An array of HSL colors in the format "hsl(hue, saturation, lightness)".
 * @param saturationValues {number[]} - An array of saturation values, between 0 and 100.
 * @param lightnessValues {number[]} - An array of lightness values, between 0 and 100.
 * @returns {string[]} - An array of modified HSL colors in the format "hsl(hue, saturation, lightness)".
 */
export function modifyColors(
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

    // The following code is useful in case I want to keep the current saturation and lightness values
    // const currentSaturation = hslColor.match(/hsl\((\d+), (\d+)%, (\d+)%\)/)![2];
    // const currentLightness = hslColor.match(/hsl\((\d+), (\d+)%, (\d+)%\)/)![3];

    modifiedHslColors.push(
      `hsl(${currentHue}, ${saturationValue}%, ${lightnessValue}%)`
    );
  }

  return modifiedHslColors;
}

/**
 * Shifts the hue values of an array of HSL colors by a given number of degrees.
 *
 * @param colors {string[]} - An array of HSL colors in the format "hsl(hue, saturation, lightness)".
 * @returns {string[]} - An array of modified HSL colors in the format "hsl(hue, saturation, lightness)".
 */
export function shiftHue(colors: string[]): string[] {
  const shiftedColors = [];

  for (const degree of [-45, 45]) {
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
