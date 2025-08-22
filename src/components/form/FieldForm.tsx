import React, { useState } from 'react';
import { useSchema } from '@/hooks/schema';
import type { Field, FieldType } from '@/types/dbml';
import ReferenceForm from './ReferenceForm';

interface FieldFormProps {
  tableName: string;
}

const fieldTypes: FieldType[] = [
  'int', 'bigint', 'varchar', 'text', 'boolean', 
  'timestamp', 'date', 'decimal', 'float', 'double', 'uuid'
];

const FieldForm: React.FC<FieldFormProps> = ({ tableName }) => {
  const { schema, addField, removeField, updateField, renameField } = useSchema();
  const [editingField, setEditingField] = useState<string>('');
  const [showingReference, setShowingReference] = useState<string>('');
  const [newField, setNewField] = useState<Partial<Field>>({
    name: '',
    type: 'varchar',
    pk: false,
    unique: false,
    notNull: false,
    autoIncrement: false,
    default: '',
    note: ''
  });

  const table = schema.tables.find(t => t.name === tableName);
  if (!table) return null;

  const handleAddField = () => {
    if (!newField.name?.trim() || !newField.type) return;
    
    const field: Field = {
      name: newField.name.trim(),
      type: newField.type,
      ...(newField.pk && { pk: true }),
      ...(newField.unique && { unique: true }),
      ...(newField.notNull && { notNull: true }),
      ...(newField.autoIncrement && { autoIncrement: true }),
      ...(newField.default?.trim() && { default: newField.default.trim() }),
      ...(newField.note?.trim() && { note: newField.note.trim() })
    };
    
    addField(tableName, field);
    
    // Reset del formulario
    setNewField({
      name: '',
      type: 'varchar',
      pk: false,
      unique: false,
      notNull: false,
      autoIncrement: false,
      default: '',
      note: ''
    });
  };

  const handleDeleteField = (fieldName: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el campo "${fieldName}"?`)) {
      removeField(tableName, fieldName);
    }
  };

  const handleEditField = (field: Field) => {
    setEditingField(field.name);
    setNewField({
      name: field.name,
      type: field.type,
      pk: field.pk || false,
      unique: field.unique || false,
      notNull: field.notNull || false,
      autoIncrement: field.autoIncrement || false,
      default: field.default || '',
      note: field.note || ''
    });
  };

  const handleSaveEdit = () => {
    if (!newField.name?.trim() || !newField.type) return;
    
    const field: Field = {
      name: newField.name.trim(),
      type: newField.type,
      ...(newField.pk && { pk: true }),
      ...(newField.unique && { unique: true }),
      ...(newField.notNull && { notNull: true }),
      ...(newField.autoIncrement && { autoIncrement: true }),
      ...(newField.default?.trim() && { default: newField.default.trim() }),
      ...(newField.note?.trim() && { note: newField.note.trim() })
    };
    
    if (editingField !== newField.name) {
      renameField(tableName, editingField, newField.name.trim());
    }
    
    updateField(tableName, field);
    setEditingField('');
    setNewField({
      name: '',
      type: 'varchar',
      pk: false,
      unique: false,
      notNull: false,
      autoIncrement: false,
      default: '',
      note: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingField('');
    setShowingReference('');
    setNewField({
      name: '',
      type: 'varchar',
      pk: false,
      unique: false,
      notNull: false,
      autoIncrement: false,
      default: '',
      note: ''
    });
  };

  const handleReferenceChange = (fieldName: string, reference: { table: string; field: string } | null) => {
    const field = table.fields.find(f => f.name === fieldName);
    if (!field) return;

    const updatedField: Field = {
      ...field,
      references: reference || undefined
    };

    updateField(tableName, updatedField);
    setShowingReference('');
  };

  const availableReferenceTables = schema.tables.filter(t => t.name !== tableName);

  return (
    <div className="space-y-3">
      {/* Formulario ultra compacto para agregar/editar campo */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-sm font-medium text-gray-800">
            {editingField ? `✏️ Editando: ${editingField}` : '➕ Nuevo Campo'}
          </h5>
          {editingField && (
            <button
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1 rounded hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
        
        <div className="space-y-2">
          {/* Fila 1: Campos básicos */}
          <div className="grid grid-cols-4 gap-2">
            <input
              type="text"
              value={newField.name || ''}
              onChange={(e) => setNewField({ ...newField, name: e.target.value })}
              className="px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Nombre"
            />
            
            <select
              value={newField.type || 'varchar'}
              onChange={(e) => setNewField({ ...newField, type: e.target.value as FieldType })}
              className="px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {fieldTypes.map(type => (
                <option key={type} value={type}>{type.toUpperCase()}</option>
              ))}
            </select>
            
            <input
              type="text"
              value={newField.default || ''}
              onChange={(e) => setNewField({ ...newField, default: e.target.value })}
              className="px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Default"
            />
            
            <input
              type="text"
              value={newField.note || ''}
              onChange={(e) => setNewField({ ...newField, note: e.target.value })}
              className="px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Nota"
            />
          </div>

          {/* Fila 2: Checkboxes compactos */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <label className="flex items-center space-x-1 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={newField.pk || false}
                  onChange={(e) => setNewField({ ...newField, pk: e.target.checked })}
                  className="w-3 h-3 text-blue-600 rounded"
                />
                <span className="text-gray-700">PK</span>
              </label>
              
              <label className="flex items-center space-x-1 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={newField.unique || false}
                  onChange={(e) => setNewField({ ...newField, unique: e.target.checked })}
                  className="w-3 h-3 text-blue-600 rounded"
                />
                <span className="text-gray-700">Único</span>
              </label>
              
              <label className="flex items-center space-x-1 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={newField.notNull || false}
                  onChange={(e) => setNewField({ ...newField, notNull: e.target.checked })}
                  className="w-3 h-3 text-blue-600 rounded"
                />
                <span className="text-gray-700">No Nulo</span>
              </label>
              
              <label className="flex items-center space-x-1 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={newField.autoIncrement || false}
                  onChange={(e) => setNewField({ ...newField, autoIncrement: e.target.checked })}
                  className="w-3 h-3 text-blue-600 rounded"
                />
                <span className="text-gray-700">Auto Inc</span>
              </label>
            </div>

            {/* Botón de acción */}
            {editingField ? (
              <button
                onClick={handleSaveEdit}
                disabled={!newField.name?.trim()}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-xs font-medium transition-colors"
              >
                Guardar
              </button>
            ) : (
              <button
                onClick={handleAddField}
                disabled={!newField.name?.trim()}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-xs font-medium transition-colors"
              >
                Agregar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista ultra compacta de campos con acciones inline */}
      {table.fields.length > 0 && (
        <div className="space-y-1">
          {table.fields.map((field) => (
            <div key={field.name}>
              <div className="bg-white border border-gray-200 rounded p-2 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="font-medium text-gray-800 text-sm">{field.name}</span>
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-mono">
                      {field.type}
                    </span>
                    
                    {/* Badges compactos */}
                    {field.pk && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-medium">PK</span>}
                    {field.unique && <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-medium">UQ</span>}
                    {field.notNull && <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-xs font-medium">NN</span>}
                    {field.autoIncrement && <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-xs font-medium">AI</span>}
                    
                    {field.default && (
                      <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded">
                        = {field.default}
                      </span>
                    )}
                    
                    {field.references && (
                      <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-xs font-medium">
                        → {field.references.table}.{field.references.field}
                      </span>
                    )}
                  </div>
                  
                  {/* Botones de acción compactos */}
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditField(field)}
                      className="text-blue-600 hover:bg-blue-100 px-2 py-1 rounded text-xs transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowingReference(showingReference === field.name ? '' : field.name)}
                      className="text-green-600 hover:bg-green-100 px-2 py-1 rounded text-xs transition-colors"
                    >
                      {field.references ? 'Ref' : 'Ref+'}
                    </button>
                    <button
                      onClick={() => handleDeleteField(field.name)}
                      className="text-red-600 hover:bg-red-100 px-2 py-1 rounded text-xs transition-colors"
                    >
                      Del
                    </button>
                  </div>
                </div>
                
                {/* Nota en línea */}
                {field.note && (
                  <div className="mt-1 text-xs text-gray-600 italic">
                    {field.note}
                  </div>
                )}
              </div>
              
              {/* Formulario de referencia compacto */}
              {showingReference === field.name && (
                <div className="ml-4 mt-1">
                  <ReferenceForm
                    tableName={tableName}
                    fieldName={field.name}
                    currentReference={field.references}
                    onSave={(reference) => handleReferenceChange(field.name, reference)}
                    onCancel={() => setShowingReference('')}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldForm;
