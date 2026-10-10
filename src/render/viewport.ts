export interface ViewportFit {
  scale: number;
  width: number;
  height: number;
}

export function computeViewportFit(
  availableWidth: number,
  availableHeight: number,
  logicalWidth: number,
  logicalHeight: number,
): ViewportFit {
  const scale = Math.min(
    availableWidth / logicalWidth,
    availableHeight / logicalHeight,
  );
  const width = Math.floor(logicalWidth * scale);
  const height = Math.floor(logicalHeight * scale);
  return { scale: width / logicalWidth, width, height };
}