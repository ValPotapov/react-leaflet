import { useMap } from 'react-leaflet';

import 'leaflet-rotatedmarker';

function useTooltipHeight() {

  const map = useMap();
  const container = map.getContainer()

  async function getTooltipHeight(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const nodeListAllTooltips = container.querySelectorAll('.leaflet-tooltip');
        const arrayAllTooltips = Array.from(nodeListAllTooltips);
        const maxHeightTooltips = Math.max(...arrayAllTooltips.map((e) => e.clientHeight));
        resolve(maxHeightTooltips);
      }, 10);
    });
  }

  return { getTooltipHeight }
}

export { useTooltipHeight };