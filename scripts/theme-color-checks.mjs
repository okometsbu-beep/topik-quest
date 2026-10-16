// Self-contained so the same calculation can run inside browser evaluate().
export function effectiveBackground(element, styleOf = getComputedStyle) {
  const layers = [];
  for (let node = element; node; node = node.parentElement) {
    const color = styleOf(node).backgroundColor;
    if (!/^rgba?\(/.test(color)) throw new Error(`Unsupported computed background: ${color}`);
    const channels = color.match(/[\d.]+/g).map(Number);
    layers.push([...channels.slice(0, 3), channels[3] ?? 1]);
    if ((channels[3] ?? 1) === 1) break;
  }
  // The browser canvas is white when no ancestor supplies an opaque background.
  return layers.reverse().reduce((behind, [r, g, b, alpha]) =>
    [r, g, b].map((channel, i) => channel * alpha + behind[i] * (1 - alpha)), [255, 255, 255]);
}
