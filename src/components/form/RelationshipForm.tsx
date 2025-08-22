import React, { useState } from 'react';
import { useSchema } from '@/hooks/schema';
import type { Relationship } from '@/types/dbml';

const RelationshipForm: React.FC = () => {
  const { schema, addRelationship, removeRelationship, updateRelationship } = useSchema();
  const [newRelationship, setNewRelationship] = useState<Partial<Relationship>>({
    from: { table: '', field: '' },
    to: { table: '', field: '' },
    type: 'one-to-many',
    onDelete: undefined,
    onUpdate: undefined
  });
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null);

  const relationshipTypes = [
    { value: 'one-to-one', label: 'Uno a Uno (1:1)' },
    { value: 'one-to-many', label: 'Uno a Muchos (1:N)' },
    { value: 'many-to-one', label: 'Muchos a Uno (N:1)' },
    { value: 'many-to-many', label: 'Muchos a Muchos (N:N)' }
  ];

  const actionTypes = [
    { value: 'CASCADE', label: 'CASCADE' },
    { value: 'SET NULL', label: 'SET NULL' },
    { value: 'RESTRICT', label: 'RESTRICT' },
    { value: 'NO ACTION', label: 'NO ACTION' }
  ];

  const getFieldsForTable = (tableName: string) => {
    const table = schema.tables.find(t => t.name === tableName);
    return table ? table.fields : [];
  };

  const handleAddRelationship = () => {
    if (!newRelationship.from?.table || !newRelationship.from?.field ||
        !newRelationship.to?.table || !newRelationship.to?.field) {
      return;
    }
    
    const relationship: Relationship = {
      from: newRelationship.from,
      to: newRelationship.to,
      type: newRelationship.type || 'one-to-many',
      ...(newRelationship.onDelete && { onDelete: newRelationship.onDelete }),
      ...(newRelationship.onUpdate && { onUpdate: newRelationship.onUpdate })
    };
    
    addRelationship(relationship);
    setNewRelationship({
      from: { table: '', field: '' },
      to: { table: '', field: '' },
      type: 'one-to-many',
      onDelete: undefined,
      onUpdate: undefined
    });
  };

  const handleDeleteRelationship = (relationship: Relationship) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta relación?')) {
      removeRelationship(relationship);
    }
  };

  const handleEditRelationship = (relationship: Relationship) => {
    setEditingRelationship(relationship);
    setNewRelationship({
      from: relationship.from,
      to: relationship.to,
      type: relationship.type,
      onDelete: relationship.onDelete,
      onUpdate: relationship.onUpdate
    });
  };

  const handleSaveEdit = () => {
    if (!editingRelationship || !newRelationship.from?.table || !newRelationship.from?.field ||
        !newRelationship.to?.table || !newRelationship.to?.field) {
      return;
    }
    
    const updatedRelationship: Relationship = {
      from: newRelationship.from,
      to: newRelationship.to,
      type: newRelationship.type || 'one-to-many',
      ...(newRelationship.onDelete && { onDelete: newRelationship.onDelete }),
      ...(newRelationship.onUpdate && { onUpdate: newRelationship.onUpdate })
    };
    
    updateRelationship(editingRelationship, updatedRelationship);
    setEditingRelationship(null);
    setNewRelationship({
      from: { table: '', field: '' },
      to: { table: '', field: '' },
      type: 'one-to-many',
      onDelete: undefined,
      onUpdate: undefined
    });
  };

  const handleCancelEdit = () => {
    setEditingRelationship(null);
    setNewRelationship({
      from: { table: '', field: '' },
      to: { table: '', field: '' },
      type: 'one-to-many',
      onDelete: undefined,
      onUpdate: undefined
    });
  };

  return (
    <div className="space-y-4">
      {/* Formulario ultra compacto para relaciones */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-800">
            {editingRelationship ? '✏️ Editando Relación' : '🔗 Nueva Relación'}
          </h3>
          {editingRelationship && (
            <button
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1 rounded hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {/* Fila 1: Tablas origen y destino */}
          <div className="grid grid-cols-4 gap-2">
            <select
              value={newRelationship.from?.table || ''}
              onChange={(e) => setNewRelationship({
                ...newRelationship,
                from: { table: e.target.value, field: '' }
              })}
              className="px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent text-sm"
            >
              <option value="">Tabla origen</option>
              {schema.tables.map(table => (
                <option key={table.name} value={table.name}>
                  {table.name}
                </option>
              ))}
            </select>
            
            <select
              value={newRelationship.from?.field || ''}
              onChange={(e) => setNewRelationship({
                ...newRelationship,
                from: { ...newRelationship.from!, field: e.target.value }
              })}
              disabled={!newRelationship.from?.table}
              className="px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent text-sm disabled:bg-gray-100"
            >
              <option value="">Campo origen</option>
              {getFieldsForTable(newRelationship.from?.table || '').map(field => (
                <option key={field.name} value={field.name}>
                  {field.name} ({field.type})
                </option>
              ))}
            </select>
            
            <select
              value={newRelationship.to?.table || ''}
              onChange={(e) => setNewRelationship({
                ...newRelationship,
                to: { table: e.target.value, field: '' }
              })}
              className="px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent text-sm"
            >
              <option value="">Tabla destino</option>
              {schema.tables.map(table => (
                <option key={table.name} value={table.name}>
                  {table.name}
                </option>
              ))}
            </select>
            
            <select
              value={newRelationship.to?.field || ''}
              onChange={(e) => setNewRelationship({
                ...newRelationship,
                to: { ...newRelationship.to!, field: e.target.value }
              })}
              disabled={!newRelationship.to?.table}
              className="px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent text-sm disabled:bg-gray-100"
            >
              <option value="">Campo destino</option>
              {getFieldsForTable(newRelationship.to?.table || '').map(field => (
                <option key={field.name} value={field.name}>
                  {field.name} ({field.type})
                </option>
              ))}
            </select>
          </div>

          {/* Fila 2: Tipo y acciones */}
          <div className="grid grid-cols-4 gap-2">
            <select
              value={newRelationship.type || 'one-to-many'}
              onChange={(e) => setNewRelationship({
                ...newRelationship,
                type: e.target.value as Relationship['type']
              })}
              className="px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent text-sm"
            >
              {relationshipTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            
            <select
              value={newRelationship.onDelete || ''}
              onChange={(e) => setNewRelationship({
                ...newRelationship,
                onDelete: e.target.value ? e.target.value as Relationship['onDelete'] : undefined
              })}
              className="px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent text-sm"
            >
              <option value="">ON DELETE...</option>
              {actionTypes.map(action => (
                <option key={action.value} value={action.value}>
                  {action.label}
                </option>
              ))}
            </select>
            
            <select
              value={newRelationship.onUpdate || ''}
              onChange={(e) => setNewRelationship({
                ...newRelationship,
                onUpdate: e.target.value ? e.target.value as Relationship['onUpdate'] : undefined
              })}
              className="px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent text-sm"
            >
              <option value="">ON UPDATE...</option>
              {actionTypes.map(action => (
                <option key={action.value} value={action.value}>
                  {action.label}
                </option>
              ))}
            </select>

            {/* Botón de acción */}
            {editingRelationship ? (
              <button
                onClick={handleSaveEdit}
                disabled={!newRelationship.from?.table || !newRelationship.from?.field || !newRelationship.to?.table || !newRelationship.to?.field}
                className="bg-green-600 text-white py-1.5 px-3 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                Guardar
              </button>
            ) : (
              <button
                onClick={handleAddRelationship}
                disabled={!newRelationship.from?.table || !newRelationship.from?.field || !newRelationship.to?.table || !newRelationship.to?.field}
                className="bg-orange-600 text-white py-1.5 px-3 rounded hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                Agregar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista compacta de relaciones existentes */}
      <div>
        <h3 className="text-base font-semibold mb-3 text-gray-800">🔗 Relaciones Existentes</h3>
        
        {(!schema.relationships || schema.relationships.length === 0) ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">No hay relaciones definidas</p>
          </div>
        ) : (
          <div className="space-y-2">
            {schema.relationships.map((relationship, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-800 text-sm">
                        {relationship.from.table}.{relationship.from.field}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium text-gray-800 text-sm">
                        {relationship.to.table}.{relationship.to.field}
                      </span>
                    </div>
                    
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      {relationship.type?.replace('-', ' ').toUpperCase()}
                    </span>
                    
                    {relationship.onDelete && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                        DEL: {relationship.onDelete}
                      </span>
                    )}
                    
                    {relationship.onUpdate && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                        UPD: {relationship.onUpdate}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditRelationship(relationship)}
                      className="text-blue-600 hover:bg-blue-100 px-2 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteRelationship(relationship)}
                      className="text-red-600 hover:bg-red-100 px-2 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RelationshipForm;
