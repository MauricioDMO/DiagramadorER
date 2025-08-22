import React, { useState } from 'react';
import { useSchema } from '@/hooks/schema';
import TableForm from './TableForm';
import RelationshipForm from './RelationshipForm';
import SchemaStats from './SchemaStats';

const SchemaForm: React.FC = () => {
  const { schema } = useSchema();
  const [activeTab, setActiveTab] = useState<'tables' | 'relationships'>('tables');

  return (
    <div className="p-4 bg-white border-r border-gray-300 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Editor de Esquema</h2>
      
      {/* Tabs */}
      <div className="flex mb-4 border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'tables'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('tables')}
        >
          Tablas ({schema.tables.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'relationships'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('relationships')}
        >
          Relaciones ({schema.relationships?.length || 0})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'tables' && <TableForm />}
      {activeTab === 'relationships' && <RelationshipForm />}

      {/* Estadísticas */}
      <SchemaStats />
    </div>
  );
};

export default SchemaForm;
