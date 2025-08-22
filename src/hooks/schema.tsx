import { useContext } from 'react';
import type { Field, Table, Relationship } from '@/types/dbml';
import { SchemaContext } from '@/context/schema';

export function useSchema() {
  const ctx = useContext(SchemaContext);
  if (!ctx) throw new Error('useSchema must be used inside SchemaProvider')

  const { schema, dispatch } = ctx

  return {
    schema,

    addField: (tableName: string, field: Field) =>
      dispatch({ type: 'ADD_FIELD', tableName, field }),

    removeField: (tableName: string, fieldName: string) =>
      dispatch({ type: 'REMOVE_FIELD', tableName, fieldName }),

    updateField: (tableName: string, field: Field) =>
      dispatch({ type: 'UPDATE_FIELD', tableName, field }),

    renameField: (tableName: string, oldFieldName: string, newFieldName: string) =>
      dispatch({ type: 'RENAME_FIELD', tableName, oldFieldName, newFieldName }),

    addTable: (table: Table) =>
      dispatch({ type: 'ADD_TABLE', table }),

    removeTable: (tableName: string) =>
      dispatch({ type: 'REMOVE_TABLE', tableName }),

    updateTable: (table: Table) =>
      dispatch({ type: 'UPDATE_TABLE', table }),

    renameTable: (oldTableName: string, newTableName: string) =>
      dispatch({ type: 'RENAME_TABLE', oldTableName, newTableName }),

    addRelationship: (relationship: Relationship) =>
      dispatch({ type: 'ADD_RELATIONSHIP', relationship }),

    removeRelationship: (relationship: Relationship) =>
      dispatch({ type: 'REMOVE_RELATIONSHIP', relationship }),

    updateRelationship: (oldRel: Relationship, newRel: Relationship) =>
      dispatch({ type: 'UPDATE_RELATIONSHIP', oldRel, newRel })
  }
}