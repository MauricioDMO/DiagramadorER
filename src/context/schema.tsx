import React, { createContext, useReducer } from 'react';
import type { DBSchema, SchemaAction } from '@/types/dbml';
import { schemaReducer } from '@/reducers/schema';

type SchemaContextType = {
  schema: DBSchema;
  dispatch: React.Dispatch<SchemaAction>;
};

const defaultSchema: DBSchema = { tables: [], relationships: [] };

export const SchemaContext = createContext<SchemaContextType>({
  schema: defaultSchema,
  dispatch: () => {}
});

export function SchemaProvider({ children }: { children: React.ReactNode }) {
  const [schema, dispatch] = useReducer(schemaReducer, defaultSchema);

  return (
    <SchemaContext.Provider value={{ schema, dispatch }}>
      {children}
    </SchemaContext.Provider>
  );
}
