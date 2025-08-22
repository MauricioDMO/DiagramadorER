import React from 'react';
import { useSchema } from '@/hooks/schema';

const SchemaStats: React.FC = () => {
  const { schema } = useSchema();

  const totalFields = schema.tables.reduce((acc, table) => acc + table.fields.length, 0);
  const totalPrimaryKeys = schema.tables.reduce((acc, table) => 
    acc + table.fields.filter(field => field.pk).length, 0
  );
  const totalForeignKeys = schema.tables.reduce((acc, table) => 
    acc + table.fields.filter(field => field.references).length, 0
  );
  const totalUniqueFields = schema.tables.reduce((acc, table) => 
    acc + table.fields.filter(field => field.unique).length, 0
  );
  const totalNotNullFields = schema.tables.reduce((acc, table) => 
    acc + table.fields.filter(field => field.notNull).length, 0
  );

  const fieldTypes = schema.tables.reduce((acc, table) => {
    table.fields.forEach(field => {
      acc[field.type] = (acc[field.type] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 mt-4">
      <h3 className="text-base font-semibold mb-2 text-blue-800">📊 Estadísticas</h3>
      
      {/* Stats principales en una fila */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-white p-2 rounded text-center">
          <div className="text-lg font-bold text-blue-600">{schema.tables.length}</div>
          <div className="text-xs text-gray-600">Tablas</div>
        </div>
        
        <div className="bg-white p-2 rounded text-center">
          <div className="text-lg font-bold text-green-600">{totalFields}</div>
          <div className="text-xs text-gray-600">Campos</div>
        </div>
        
        <div className="bg-white p-2 rounded text-center">
          <div className="text-lg font-bold text-purple-600">{schema.relationships?.length || 0}</div>
          <div className="text-xs text-gray-600">Relaciones</div>
        </div>
        
        <div className="bg-white p-2 rounded text-center">
          <div className="text-lg font-bold text-orange-600">{totalForeignKeys}</div>
          <div className="text-xs text-gray-600">FK</div>
        </div>
      </div>

      {/* Stats secundarias compactas */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex justify-between bg-white/50 px-2 py-1 rounded">
          <span>PK:</span>
          <span className="font-medium">{totalPrimaryKeys}</span>
        </div>
        <div className="flex justify-between bg-white/50 px-2 py-1 rounded">
          <span>Únicos:</span>
          <span className="font-medium">{totalUniqueFields}</span>
        </div>
        <div className="flex justify-between bg-white/50 px-2 py-1 rounded">
          <span>No Nulos:</span>
          <span className="font-medium">{totalNotNullFields}</span>
        </div>
      </div>

      {/* Top tipos de datos */}
      {Object.keys(fieldTypes).length > 0 && (
        <div className="mt-2">
          <h4 className="text-xs font-medium mb-1 text-blue-700">Tipos más usados:</h4>
          <div className="flex flex-wrap gap-1">
            {Object.entries(fieldTypes)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 4)
              .map(([type, count]) => (
                <span key={type} className="bg-white text-xs px-2 py-0.5 rounded">
                  {type}: {count}
                </span>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemaStats;
