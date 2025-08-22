import { useSchema } from "@/hooks/schema"
import { convertSchemaToDBML } from "@/lib/dbml"
import html2canvas from "html2canvas"
import { useEffect, useRef, useState } from "react"
import { ReactSVGPanZoom, TOOL_NONE } from "react-svg-pan-zoom"
import type { Value, Tool } from "react-svg-pan-zoom"
import { ReactSvgPanZoomLoader } from 'react-svg-pan-zoom-loader';
import { ExplorerOptions } from "./ExplorerOptions"

const INITIAL_VALUE: Value = {
  version: 2,
  mode: 'panning',
  focus: false,
  a: 0.1,
  b: 0,
  c: 0,
  d: 0.1,
  e: 0,
  f: 0,
  viewerWidth: 500,
  viewerHeight: 500,
  SVGWidth: 500,
  SVGHeight: 500,
  startX: null,
  startY: null,
  endX: null,
  endY: null,
  miniatureOpen: false
}

export default function SVGFromString() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<ReactSVGPanZoom>(null)
  const { schema } = useSchema()
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })
  const [tool, setTool] = useState<Tool>(TOOL_NONE)
  const [value, setValue] = useState<Value>(INITIAL_VALUE)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth || 800,
          height: containerRef.current.clientHeight || 600
        })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Función para calcular el zoom que mejor ajuste el SVG al contenedor
  const calculateFitZoom = (svgWidth: number, svgHeight: number, containerWidth: number, containerHeight: number) => {
    const scaleX = containerWidth / svgWidth
    const scaleY = containerHeight / svgHeight
    // Usar el menor de los dos para que quepa completamente
    return Math.min(scaleX, scaleY) * 0.9 // 0.9 para dejar un poco de margen
  }

  useEffect(() => {
    const getSVG = async () => {
      const dbml = convertSchemaToDBML(schema)
      const req = await fetch('/api/svg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dbml })
      })
      const svg = await req.text()
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, "image/svg+xml");
      const svgNode: SVGSVGElement = doc.documentElement as unknown as SVGSVGElement;

      // Clonar para react
      const clonedSvg = svgNode.cloneNode(true) as SVGSVGElement;
      
      // Usar setTimeout para evitar layout shift brusco
      setTimeout(() => {
        setSvgElement(clonedSvg);

        // Solo ajustar el zoom en la primera carga o cuando el contenedor cambia significativamente
        if (isFirstLoad || !value.SVGWidth) {
          const svgWidth = clonedSvg.width.baseVal.value
          const svgHeight = clonedSvg.height.baseVal.value
          const containerWidth = containerRef.current?.clientWidth ?? 800
          const containerHeight = containerRef.current?.clientHeight ?? 600
          
          const autoZoom = calculateFitZoom(svgWidth, svgHeight, containerWidth, containerHeight)
          const finalZoom = Math.min(0.5, autoZoom)
          
          const offsetX = (containerWidth - svgWidth * finalZoom) / 2
          const offsetY = (containerHeight - svgHeight * finalZoom) / 2
          
          const newValue: Value = {
            ...value,
            a: finalZoom,
            d: finalZoom,
            e: Math.max(0, offsetX),
            f: Math.max(0, offsetY),
            viewerWidth: containerWidth,
            viewerHeight: containerHeight,
            SVGWidth: svgWidth,
            SVGHeight: svgHeight
          }
          
          setValue(newValue)
          setIsFirstLoad(false)
        }
      }, 100) // Pequeño delay para suavizar el cambio
    }

    getSVG()
  }, [schema]) // Solo depende del schema, no del value

  // Solo actualizar el zoom cuando cambie el tamaño del contenedor, no cuando cambie el SVG
  useEffect(() => {
    if (svgElement && !isFirstLoad) {
      const containerWidth = containerRef.current?.clientWidth ?? 800
      const containerHeight = containerRef.current?.clientHeight ?? 600
      
      // Solo actualizar las dimensiones del viewer, mantener el zoom actual
      setValue(prevValue => ({
        ...prevValue,
        viewerWidth: containerWidth,
        viewerHeight: containerHeight
      }))
    }
  }, [containerSize, isFirstLoad]) // Solo cuando cambie el tamaño del contenedor

  // Función para manejar cambios de valor
  const handleValueChange = (newValue: Value) => {
    setValue(newValue)
  }

  // Función para hacer fit manual
  const handleFitToViewer = () => {
    if (viewerRef.current) {
      viewerRef.current.fitToViewer()
    }
  }

  // Función para hacer zoom automático
  const handleAutoZoom = () => {
    if (viewerRef.current && svgElement) {
      const svgWidth = svgElement.width.baseVal.value
      const svgHeight = svgElement.height.baseVal.value
      const containerWidth = containerRef.current?.clientWidth ?? 800
      const containerHeight = containerRef.current?.clientHeight ?? 600
      
      const autoZoom = calculateFitZoom(svgWidth, svgHeight, containerWidth, containerHeight)
      const finalZoom = Math.min(0.5, autoZoom)
      
      viewerRef.current.setPointOnViewerCenter(svgWidth / 2, svgHeight / 2, finalZoom)
    }
  }

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: "100%", 
        height: "100%", 
        minHeight: "400px", 
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* Botones de control temporales para testing */}
      <ExplorerOptions
        handleFitToViewer={handleFitToViewer}
        handleAutoZoom={handleAutoZoom}
        svgElement={svgElement}
        viewerRef={viewerRef}
      />

      {svgElement ? (
        <ReactSvgPanZoomLoader 
          svgXML={svgElement.outerHTML} 
          render={(content) => (
            <ReactSVGPanZoom
              className="inline-block w-full h-full"
              style={{ 
                transition: 'opacity 0.3s ease-in-out',
                opacity: isFirstLoad ? 0.8 : 1
              }}
              background="#fff"
              ref={viewerRef}
              width={containerSize.width}
              height={containerSize.height}
              tool={tool}
              value={value}
              onChangeTool={setTool}
              onChangeValue={handleValueChange}
              detectAutoPan={false}
              scaleFactorMin={0.1}
              scaleFactorMax={3}
            >
              <svg width={svgElement.width.baseVal.value} height={svgElement.height.baseVal.value}>
                {content}
              </svg>
            </ReactSVGPanZoom>
          )} 
        />
      ) : (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: '#666'
        }}>
          <div>Generando diagrama...</div>
        </div>
      )}
    </div>
  );
}
