// Test del reducer para debuggear el problema
import type { DBSchema, SchemaAction } from '@/types/dbml';
import { schemaReducer } from '@/reducers/schema';

// Estado inicial con una tabla
const initialState: DBSchema = {
  tables: [
    {
      name: 'a',
      fields: []
    }
  ],
  relationships: []
};

// Acción para agregar un campo
const addFieldAction: SchemaAction = {
  type: 'ADD_FIELD',
  tableName: 'a',
  field: {
    name: 'id',
    type: 'int',
    pk: true
  }
};

// Probar el reducer
const newState = schemaReducer(initialState, addFieldAction);

console.log('Estado inicial:', initialState);
console.log('Acción:', addFieldAction);
console.log('Nuevo estado:', newState);

export { initialState, addFieldAction, newState };
