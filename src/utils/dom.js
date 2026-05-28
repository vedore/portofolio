export const getMeasuredViewportHeight = (container) =>
  container?.clientHeight || window.visualViewport?.height || window.innerHeight || 1;

export const getInteractiveElement = (element) =>
  element?.closest?.('input, textarea, select, button, a');
