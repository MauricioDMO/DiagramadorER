import React, { useState } from 'react';
import { useSchema } from '@/hooks/schema';
import type { Table } from '@/types/dbml';
import FieldForm from './FieldForm';

const TableForm: React.FC = () => {
  const { schema, addTable, removeTable, updateTable, renameTable } = useSchema();
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [newTableName, setNewTableName] = useState('');
  const [newTableNote, setNewTableNote] = useState('');
  const [editingTable, setEditingTable] = useState<string>('');
  const [editTableName, setEditTableName] = useState('');
  const [editTableNote, setEditTableNote] = useState('');

  const handleAddTable = () => {
    if (!newTableName.trim()) {
      return;
    }
    
    const newTable: Table = {
      name: newTableName.trim(),
      note: newTableNote.trim() || undefined,
      fields: []
    };

    addTable(newTable);
    setNewTableName('');
    setNewTableNote('');
  };

  const handleDeleteTable = (tableName: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la tabla "${tableName}"?`)) {
      removeTable(tableName);
      if (selectedTable === tableName) {
        setSelectedTable('');
      }
    }
  };

  const handleEditTable = (table: Table) => {
    setEditingTable(table.name);
    setEditTableName(table.name);
    setEditTableNote(table.note || '');
  };

  const handleSaveTableEdit = () => {
    if (!editTableName.trim()) return;
    
    const table = schema.tables.find(t => t.name === editingTable);
    if (!table) return;

    if (editTableName !== editingTable) {
      renameTable(editingTable, editTableName.trim());
    }
    
    const updatedTable: Table = {
      ...table,
      name: editTableName.trim(),
      note: editTableNote.trim() || undefined
    };
    
    updateTable(updatedTable);
    setEditingTable('');
    setEditTableName('');
    setEditTableNote('');
  };

  const handleCancelEdit = () => {
    setEditingTable('');
    setEditTableName('');
    setEditTableNote('');
  };

  const handleNewTableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewTableName(value.trim())
  }

  

  return (
    <div className="space-y-4">
      {/* Formulario compacto para agregar tabla */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-base font-semibold mb-3 text-gray-800">➕ Nueva Tabla</h3>
        <div className="grid grid-cols-3 gap-3">
          <input
            type="text"
            value={newTableName}
            onChange={handleNewTableChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            placeholder="Nombre de la tabla"
          />
          <input
            type="text"
            value={newTableNote}
            onChange={(e) => setNewTableNote(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            placeholder="Nota (opcional)"
          />
          <button
            onClick={handleAddTable}
            disabled={!newTableName.trim()}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Lista compacta de tablas */}
      <div>
        <h3 className="text-base font-semibold mb-3 text-gray-800">📋 Tablas del Esquema</h3>
        
        {schema.tables.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">No hay tablas definidas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schema.tables.map((table) => (
              <div key={table.name} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {editingTable === table.name ? (
                  <div className="bg-yellow-50 p-3 border-l-4 border-yellow-400">
                    <div className="grid grid-cols-4 gap-3 items-end">
                      <input
                        type="text"
                        value={editTableName}
                        onChange={(e) => setEditTableName(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Nombre"
                      />
                      <input
                        type="text"
                        value={editTableNote}
                        onChange={(e) => setEditTableNote(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Nota"
                      />
                      <button
                        onClick={handleSaveTableEdit}
                        className="bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 text-sm font-medium"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white py-2 px-3 rounded-md hover:bg-gray-600 text-sm font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3">
                    {/* Header de la tabla */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-gray-800 text-base">{table.name}</h4>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {table.fields.length} campos
                        </span>
                        {table.note && (
                          <span className="text-xs text-gray-600 italic">"{table.note}"</span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTable(table)}
                          className="text-blue-600 hover:bg-blue-100 px-2 py-1 rounded text-xs font-medium transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteTable(table.name)}
                          className="text-red-600 hover:bg-red-100 px-2 py-1 rounded text-xs font-medium transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                    
                    {/* Formulario de campos integrado */}
                    <div className="mt-3 border-t border-gray-200 pt-3">
                      <FieldForm tableName={table.name} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableForm;
