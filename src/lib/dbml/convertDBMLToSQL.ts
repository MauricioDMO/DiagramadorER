import { exporter } from '@dbml/core'
import type { ExportFormatOption } from '@dbml/core/types/export/ModelExporter'

export type SupportedSQLEngine = ExportFormatOption

export function convertDBMLToSQL(dbml: string, sqlEngine: SupportedSQLEngine) {
  try {
    const sql = exporter.export(dbml, sqlEngine)
    return sql
  } catch (error) {
    console.error("Error converting DBML to SQL:", error)
    return null
  }
}
