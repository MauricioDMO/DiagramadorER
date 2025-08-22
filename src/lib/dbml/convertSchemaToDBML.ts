import type { DBSchema, Relationship } from "@/types/dbml";

function parseToDBML(schema: DBSchema) {
  return schema.tables.map(table => {
    const fields = table.fields.map(field => {
      const options = [];

      if (field.pk) options.push("pk");
      if (field.notNull) options.push("not null");
      if (field.unique) options.push("unique");
      if (field.autoIncrement) options.push("increment");
      if (field.default) options.push(`default: '${field.default}'`);
      // Removemos la referencia inline, la manejaremos como relación explícita

      return `  ${field.name} ${field.type}${options.length ? " [" + options.join(", ") + "]" : ""}`;
    });

    return `Table ${table.name} {\n${fields.join("\n")}\n  Note: '${table.note || ""}'\n}`;
  }).join("\n\n");
}

// Nueva función para extraer relaciones de las referencias de campos
function extractRelationshipsFromFields(schema: DBSchema): Relationship[] {
  const extractedRelationships: Relationship[] = [];
  
  schema.tables.forEach(table => {
    table.fields.forEach(field => {
      if (field.references) {
        // Para FK: la relación va desde la tabla referenciada hacia la tabla actual
        // Esto significa: tabla_referenciada.campo_pk < tabla_actual.campo_fk
        extractedRelationships.push({
          from: { table: field.references.table, field: field.references.field },
          to: { table: table.name, field: field.name },
          type: "one-to-many" // Una PK puede tener muchas FKs que la referencien
        });
      }
    });
  });
  
  return extractedRelationships;
}


function parseRelationshipsToDBML(relationships: Relationship[] = []) {
  return relationships.map(rel => {
    // Determinar el símbolo de relación basado en el tipo
    let relationSymbol = ">";
    
    switch (rel.type) {
      case "one-to-one":
        relationSymbol = "-";
        break;
      case "one-to-many":
        relationSymbol = "<"; // Uno a muchos: desde la PK hacia las FKs
        break;
      case "many-to-one":
        relationSymbol = ">"; // Muchos a uno: desde las FKs hacia la PK
        break;
      case "many-to-many":
        relationSymbol = "><"; // Muchos a muchos
        break;
      default:
        relationSymbol = "<"; // Por defecto one-to-many para FKs
    }
    
    const relLine = `Ref: ${rel.from.table}.${rel.from.field} ${relationSymbol} ${rel.to.table}.${rel.to.field}`;
    const actions = [];

    if (rel.onDelete) actions.push(`on delete ${rel.onDelete}`);
    if (rel.onUpdate) actions.push(`on update ${rel.onUpdate}`);

    return actions.length ? `${relLine} [${actions.join(", ")}]` : relLine;
  }).join("\n");
}


export function convertSchemaToDBML(schema: DBSchema) {
  const tablesPart = parseToDBML(schema);
  
  // Combinar relaciones explícitas con las extraídas de referencias de campos
  const fieldRelationships = extractRelationshipsFromFields(schema);
  const allRelationships = [...fieldRelationships, ...(schema.relationships || [])];
  
  const relationsPart = parseRelationshipsToDBML(allRelationships);

  return `${tablesPart}\n\n${relationsPart}`;
}
