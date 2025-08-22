import React from 'react';
import { SchemaProvider } from '@/context/schema';
import { SchemaForm } from '@/components/form';
import SVGFromString from '@/components/SVGExplorer';

export default function App() {
  return (
    <SchemaProvider>
      <div className="grid grid-cols-2 gap-4 h-[80vh] m-4">
        <SchemaForm />
        <SVGFromString />
      </div>
    </SchemaProvider>
  );
}