import { useState } from "react";
import type { ReactSVGPanZoom } from "react-svg-pan-zoom";
import { ExportOptions } from "./ExportOptions";

type ExplorerOptionsProps = {
  handleFitToViewer: () => void;
  handleAutoZoom: () => void;
  svgElement: SVGSVGElement | null;
  viewerRef: React.RefObject<ReactSVGPanZoom | null>;
};

export function ExplorerOptions ({
  handleFitToViewer,
  handleAutoZoom,
  svgElement,
  viewerRef
}: ExplorerOptionsProps) {
  const [openExport, setOpenExport] = useState(false)


  return (
    <div 
      className="bg-white shadow-md p-2 rounded left-2 top-2 absolute z-10 flex justify-between w-3/4"
    >
      <div className="flex space-x-2">
        <button
          onClick={handleFitToViewer}
          className="p-2 bg-blue-600 text-white rounded-md"
        >
          Fit to Screen
        </button>
        <button
          onClick={handleAutoZoom}
          className="p-2 bg-green-600 text-white rounded-md"
        >
          Auto Zoom (0.5)
        </button>
      </div>
      <button
        className="rounded font-bold p-2 text-white bg-emerald-500"
        onClick={() => setOpenExport(!openExport)}
      >
        Exportar
      </button>

      {openExport && <ExportOptions
        svgElement={svgElement}
        viewerRef={viewerRef}
        close={() => setOpenExport(false)}
      />}
    </div>
  )
}