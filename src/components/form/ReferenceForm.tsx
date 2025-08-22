import React, { useState } from 'react';
import { useSchema } from '@/hooks/schema';
import type { Field } from '@/types/dbml';

interface ReferenceFormProps {
  tableName: string;
  fieldName: string;
  currentReference?: { table: string; field: string };
  onSave: (reference: { table: string; field: string } | null) => void;
  onCancel: () => void;
}

const ReferenceForm: React.FC<ReferenceFormProps> = ({
  tableName,
  fieldName,
  currentReference,
  onSave,
  onCancel
}) => {
  const { schema } = useSchema();
  const [selectedTable, setSelectedTable] = useState(currentReference?.table || '');
  const [selectedField, setSelectedField] = useState(currentReference?.field || '');

  const availableTables = schema.tables.filter(t => t.name !== tableName);

  const getFieldsForTable = (tableNameToSearch: string) => {
    const table = schema.tables.find(t => t.name === tableNameToSearch);
    return table ? table.fields : [];
  };

  const handleSave = () => {
    if (selectedTable && selectedField) {
      onSave({ table: selectedTable, field: selectedField });
    } else {
      onSave(null);
    }
  };

  const handleRemoveReference = () => {
    onSave(null);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
      <h5 className="text-sm font-medium mb-2 text-gray-800">
        🔗 Referencia: {tableName}.{fieldName}
      </h5>
      
      <div className="grid grid-cols-3 gap-2 mb-2">
        <select
          value={selectedTable}
          onChange={(e) => {
            setSelectedTable(e.target.value);
            setSelectedField('');
          }}
          className="px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
        >
          <option value="">Sin referencia</option>
          {availableTables.map(table => (
            <option key={table.name} value={table.name}>
              {table.name} ({table.fields.length})
            </option>
          ))}
        </select>
        
        {selectedTable && (
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
          >
            <option value="">Campo...</option>
            {getFieldsForTable(selectedTable).map(field => (
              <option key={field.name} value={field.name}>
                {field.name} ({field.type}){field.pk && ' PK'}{field.unique && ' UQ'}
              </option>
            ))}
          </select>
        )}
        
        <div className="flex space-x-1">
          <button
            onClick={handleSave}
            className="flex-1 bg-green-600 text-white py-1.5 px-2 rounded hover:bg-green-700 text-xs font-medium transition-colors"
          >
            OK
          </button>
          {currentReference && (
            <button
              onClick={handleRemoveReference}
              className="flex-1 bg-red-600 text-white py-1.5 px-2 rounded hover:bg-red-700 text-xs font-medium transition-colors"
            >
              Quitar
            </button>
          )}
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-500 text-white py-1.5 px-2 rounded hover:bg-gray-600 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferenceForm;
