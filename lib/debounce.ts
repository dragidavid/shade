export function debounce(func: Function, wait: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: any[]) => {
    if (timeoutId !== null) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
