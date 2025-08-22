type FieldType =
  | "int"
  | "bigint"
  | "varchar"
  | "text"
  | "boolean"
  | "timestamp"
  | "date"
  | "decimal"
  | "float"
  | "double"
  | "uuid"
  | string;

type Field = {
  name: string;
  type: FieldType;
  pk?: boolean;
  unique?: boolean;
  notNull?: boolean;
  autoIncrement?: boolean;
  default?: string;
  note?: string;
  references?: {
    table: string;
    field: string;
  };
};

type Table = {
  name: string;
  note?: string;
  fields: Field[];
};

type Relationship = {
  from: { table: string; field: string };
  to: { table: string; field: string };
  type?: "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many";
  onDelete?: "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION";
  onUpdate?: "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION";
};

type DBSchema = {
  tables: Table[];
  relationships?: Relationship[];
};

type SchemaAction =
  | { type: 'ADD_FIELD'; tableName: string; field: Field }
  | { type: 'REMOVE_FIELD'; tableName: string; fieldName: string }
  | { type: 'UPDATE_FIELD'; tableName: string; field: Field }
  | { type: 'RENAME_FIELD'; tableName: string; oldFieldName: string; newFieldName: string }
  | { type: 'ADD_TABLE'; table: Table }
  | { type: 'REMOVE_TABLE'; tableName: string }
  | { type: 'UPDATE_TABLE'; table: Table }
  | { type: 'RENAME_TABLE'; oldTableName: string; newTableName: string }
  | { type: 'ADD_RELATIONSHIP'; relationship: Relationship }
  | { type: 'REMOVE_RELATIONSHIP'; relationship: Relationship }
  | { type: 'UPDATE_RELATIONSHIP'; oldRel: Relationship; newRel: Relationship };



export {
  FieldType,
  Field,
  Table,
  Relationship,
  DBSchema,
  SchemaAction
}