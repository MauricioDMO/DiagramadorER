import type { DBSchema, SchemaAction } from '@/types/dbml';

export function schemaReducer(state: DBSchema, action: SchemaAction): DBSchema {
  console.log('🚀 Reducer called with action:', action.type);
  
  switch (action.type) {
    case 'ADD_FIELD':
      console.log('🔥 Reducer ADD_FIELD - table:', action.tableName, 'field:', action.field.name);
      
      const newState = {
        ...state,
        tables: state.tables.map(t =>
          t.name === action.tableName
            ? { ...t, fields: [...t.fields, action.field] }
            : t
        )
      };
      
      console.log('🔥 Reducer ADD_FIELD - success, new state has', newState.tables.find(t => t.name === action.tableName)?.fields.length, 'fields');
      return newState;
    case 'REMOVE_FIELD':
      return {
        ...state,
        tables: state.tables.map(t =>
          t.name === action.tableName
            ? { ...t, fields: t.fields.filter(f => f.name !== action.fieldName) }
            : t
        )
      };
    case 'UPDATE_FIELD':
      return {
        ...state,
        tables: state.tables.map(t =>
          t.name === action.tableName
            ? {
                ...t,
                fields: t.fields.map(f =>
                  f.name === action.field.name ? action.field : f
                )
              }
            : t
        )
      };
    case 'RENAME_FIELD':
      return {
        ...state,
        tables: state.tables.map(t =>
          t.name === action.tableName
            ? {
                ...t,
                fields: t.fields.map(f =>
                  f.name === action.oldFieldName 
                    ? { ...f, name: action.newFieldName }
                    : f
                )
              }
            : t
        ),
        relationships: state.relationships?.map(rel => ({
          ...rel,
          from: rel.from.table === action.tableName && rel.from.field === action.oldFieldName
            ? { ...rel.from, field: action.newFieldName }
            : rel.from,
          to: rel.to.table === action.tableName && rel.to.field === action.oldFieldName
            ? { ...rel.to, field: action.newFieldName }
            : rel.to
        }))
      };
    case 'ADD_TABLE':
      return {
        ...state,
        tables: [...state.tables, action.table]
      };
    case 'REMOVE_TABLE':
      return {
        ...state,
        tables: state.tables.filter(t => t.name !== action.tableName),
        relationships: state.relationships?.filter(rel =>
          rel.from.table !== action.tableName && rel.to.table !== action.tableName
        )
      };
    case 'UPDATE_TABLE':
      return {
        ...state,
        tables: state.tables.map(t =>
          t.name === action.table.name ? action.table : t
        )
      };
    case 'RENAME_TABLE':
      return {
        ...state,
        tables: state.tables.map(t =>
          t.name === action.oldTableName 
            ? { ...t, name: action.newTableName }
            : t
        ),
        relationships: state.relationships?.map(rel => ({
          ...rel,
          from: rel.from.table === action.oldTableName
            ? { ...rel.from, table: action.newTableName }
            : rel.from,
          to: rel.to.table === action.oldTableName
            ? { ...rel.to, table: action.newTableName }
            : rel.to
        }))
      };
    case 'ADD_RELATIONSHIP':
      return {
        ...state,
        relationships: [...(state.relationships || []), action.relationship]
      };
    case 'REMOVE_RELATIONSHIP':
      return {
        ...state,
        relationships: state.relationships?.filter(rel =>
          !(rel.from.table === action.relationship.from.table &&
            rel.from.field === action.relationship.from.field &&
            rel.to.table === action.relationship.to.table &&
            rel.to.field === action.relationship.to.field)
        )
      };
    case 'UPDATE_RELATIONSHIP':
      return {
        ...state,
        relationships: state.relationships?.map(rel =>
          rel.from.table === action.oldRel.from.table &&
          rel.from.field === action.oldRel.from.field &&
          rel.to.table === action.oldRel.to.table &&
          rel.to.field === action.oldRel.to.field
            ? action.newRel
            : rel
        )
      };
    default:
      return state;
  }
}