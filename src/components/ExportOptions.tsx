import { useSchema } from "@/hooks/schema";
import { convertDBMLToSQL, convertSchemaToDBML, type SupportedSQLEngine } from "@/lib/dbml";
import html2canvas from "html2canvas";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { ReactSVGPanZoom } from "react-svg-pan-zoom";

type ExportOptionsProps = {
  svgElement: SVGSVGElement | null;
  viewerRef: React.RefObject<ReactSVGPanZoom | null>;
  close: () => void;
};

export function ExportOptions ({
  svgElement,
  viewerRef,
  close
}: ExportOptionsProps) {
  const [sqlCode, setSqlCode] = useState<string | null>(null)
  const { schema } = useSchema()

  const handleExportSql = (sqlType: SupportedSQLEngine) => {
    const dbml = convertSchemaToDBML(schema)
    const code = convertDBMLToSQL(dbml, sqlType)
    setSqlCode(code)
  }


  return createPortal(
    <section
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          close()
        }
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl relative min-w-[50%] max-w-2xl w-full animate-in fade-in-0 zoom-in-95 duration-200">
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-200"
          onClick={close}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Opciones de Exportación
            </h2>
            <p className="text-gray-600">
              Exporta tu diagrama en diferentes formatos
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                if (svgElement && viewerRef?.current) {
                  // Crear un contenedor temporal con el SVG para capturar
                  const tempDiv = document.createElement('div');
                  tempDiv.style.position = 'absolute';
                  tempDiv.style.left = '-9999px';
                  tempDiv.style.top = '-9999px';
                  tempDiv.style.background = 'white';
                  tempDiv.style.padding = '20px';
                  
                  // Clonar el SVG y agregarlo al contenedor temporal
                  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
                  tempDiv.appendChild(svgClone);
                  document.body.appendChild(tempDiv);
                  
                  html2canvas(tempDiv, {
                    backgroundColor: 'white',
                    scale: 1
                  }).then((canvas) => {
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/png');
                    link.download = 'diagram.png';
                    link.click();
                    
                    // Limpiar el contenedor temporal
                    document.body.removeChild(tempDiv);
                  }).catch((error) => {
                    console.error('Error al exportar imagen:', error);
                    document.body.removeChild(tempDiv);
                  });
                }
              }}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Exportar como Imagen
            </button>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                🧑‍💻 Exportar como SQL
              </h3>
              <div className="space-y-2">
                <button
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                  onClick={() => handleExportSql("postgres")}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.111 5.441c-.21-2.833-2.73-4.041-4.699-4.041-1.969 0-4.489 1.208-4.699 4.041v13.118c.21 2.833 2.73 4.041 4.699 4.041 1.969 0 4.489-1.208 4.699-4.041V5.441zM.889 5.441c.21-2.833 2.73-4.041 4.699-4.041 1.969 0 4.489 1.208 4.699 4.041v13.118c-.21 2.833-2.73 4.041-4.699 4.041-1.969 0-4.489-1.208-4.699-4.041V5.441z"/>
                  </svg>
                  PostgreSQL
                </button>
                <button
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                  onClick={() => handleExportSql("mysql")}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.274.054.107.146.267.183.378l.027-.014c.104-.054.157-.164.274-.211.039-.025.079-.046.118-.069-.004-.024-.006-.049-.011-.074-.036-.054-.104-.096-.157-.157-.077-.084-.16-.184-.268-.184l-.027.011zm4.085 4.599c-.272.008-.536.055-.809.076-.028.014-.084.039-.084.075 0 .014.014.025.028.039.082.104.208.184.314.267.115.093.244.184.378.244.134.069.287.096.418.158.069.033.157.054.214.104v-.013c-.049-.069-.061-.158-.118-.214-.073-.061-.146-.123-.214-.184-.096-.096-.207-.184-.294-.294-.061-.078-.108-.158-.157-.244-.049-.089-.079-.184-.118-.274l-.014.014z"/>
                  </svg>
                  MySQL
                </button>
                <button
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                  onClick={() => handleExportSql("mssql")}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  SQL Server
                </button>
              </div>
            </div>
          </div>

          {/* Code viewer */}
          {sqlCode && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Código SQL generado</h3>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <pre className="p-4 max-h-64 overflow-auto text-sm font-mono text-gray-800 leading-relaxed">
                  {sqlCode}
                </pre>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <button
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                  onClick={() => {
                    navigator.clipboard.writeText(sqlCode);
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar código
                </button>
                <button
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                  onClick={() => {
                    const blob = new Blob([sqlCode], { type: 'text/plain' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'export.sql';
                    link.click();
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descargar .sql
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      

    </section>,
    document.body
  )
}