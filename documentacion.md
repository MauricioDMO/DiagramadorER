# Documentación del Diagramador ER

## 📋 Descripción General

El **Diagramador ER** es una aplicación web desarrollada con **Astro**, **React** y **TypeScript** que permite crear, editar y visualizar diagramas de entidad-relación de bases de datos de manera interactiva. La aplicación genera automáticamente representaciones visuales de esquemas de bases de datos y permite exportarlos en diferentes formatos.

## 🏗️ Arquitectura de la Aplicación

### Tecnologías Principales

- **Frontend Framework**: Astro 5.7.0 con integración React 19.1.1
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 3.3.6  
- **Estado**: React Context + useReducer
- **Renderizado de Diagramas**: @softwaretechnik/dbml-renderer
- **Conversión de Datos**: @dbml/core
- **Visualización SVG**: react-svg-pan-zoom
- **Exportación**: html2canvas
- **Gestor de Paquetes**: pnpm

### Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── App.tsx         # Componente principal de la aplicación
│   ├── SVGExplorer.tsx # Visor de diagramas con zoom/pan
│   ├── ExportOptions.tsx # Modal de exportación
│   ├── ExplorerOptions.tsx # Controles del visor
│   └── form/           # Formularios de edición
│       ├── index.tsx
│       ├── SchemaForm.tsx    # Formulario principal con tabs
│       ├── TableForm.tsx     # Gestión de tablas
│       ├── FieldForm.tsx     # Gestión de campos
│       ├── RelationshipForm.tsx # Gestión de relaciones
│       ├── ReferenceForm.tsx # Formulario de referencias FK
│       └── SchemaStats.tsx   # Estadísticas del esquema
├── context/            # Contexto de React para estado global
│   └── schema.tsx
├── hooks/              # Custom hooks
│   └── schema.tsx
├── lib/               # Lógica de negocio y utilidades
│   └── dbml/
│       ├── convertSchemaToDBML.ts  # Convierte esquema a DBML
│       ├── convertDBMLToSQL.ts     # Convierte DBML a SQL
│       ├── example.ts
│       ├── relationship-examples.ts
│       └── index.ts
├── pages/             # Páginas de Astro
│   ├── index.astro    # Página principal
│   └── api/
│       └── svg.ts     # API endpoint para generar SVG
├── reducers/          # Reducers para gestión de estado
│   └── schema.tsx
├── types/             # Definiciones de tipos TypeScript
│   └── dbml.d.ts
└── layouts/           # Layouts de Astro
    ├── Layout.astro
    └── global.css
```

## 🎯 Funcionalidades Principales

### 1. **Gestión de Esquemas de Base de Datos**

La aplicación permite crear y gestionar esquemas de bases de datos completos mediante:

#### Gestión de Tablas
- **Crear tablas**: Agregar nuevas tablas con nombre y descripción
- **Editar tablas**: Modificar nombre y notas de tablas existentes
- **Eliminar tablas**: Remover tablas (con confirmación de seguridad)
- **Validación**: Nombres únicos y campos obligatorios

#### Gestión de Campos
- **Tipos de datos soportados**: int, bigint, varchar, text, boolean, timestamp, date, decimal, float, double, uuid
- **Propiedades de campos**:
  - Primary Key (PK)
  - Unique (UQ)
  - Not Null (NN)
  - Auto Increment (AI)
  - Valor por defecto
  - Notas descriptivas
- **Referencias (Foreign Keys)**: Establecer relaciones entre tablas

#### Gestión de Relaciones
- **Tipos de relaciones**: one-to-one, one-to-many, many-to-one, many-to-many
- **Acciones referenciales**: CASCADE, SET NULL, RESTRICT, NO ACTION
- **Validación**: Verificación de integridad referencial

### 2. **Visualización Interactiva**

#### Visor de Diagramas SVG
- **Renderizado dinámico**: Generación automática de diagramas al modificar el esquema
- **Controles de navegación**:
  - Zoom in/out con rueda del mouse
  - Pan (arrastrar) para navegar
  - Fit to viewer (ajustar al contenedor)
  - Auto zoom inteligente
- **Responsivo**: Se adapta al tamaño del contenedor

#### Interfaz de Usuario
- **Diseño en dos paneles**: Editor a la izquierda, visualizador a la derecha
- **Tabs organizados**: Separación entre tablas y relaciones
- **Feedback visual**: Estados de carga, confirmaciones, validaciones
- **Responsive**: Adaptable a diferentes tamaños de pantalla

### 3. **Sistema de Exportación**

#### Formatos Soportados
- **Imagen PNG**: Captura de pantalla del diagrama
- **SQL Scripts**: 
  - PostgreSQL
  - MySQL
  - SQL Server (MSSQL)

#### Funcionalidades de Exportación
- **Copiar al portapapeles**: Código SQL generado
- **Descarga de archivos**: .png para imágenes, .sql para scripts
- **Vista previa**: Código SQL antes de exportar
- **Modal intuitivo**: Interfaz clara y organizada

## 🏛️ Arquitectura Técnica

### Estado Global con Context API

```typescript
// Tipos principales
type DBSchema = {
  tables: Table[];
  relationships?: Relationship[];
};

type SchemaAction = 
  | { type: 'ADD_FIELD'; tableName: string; field: Field }
  | { type: 'REMOVE_FIELD'; tableName: string; fieldName: string }
  | { type: 'UPDATE_FIELD'; tableName: string; field: Field }
  // ... más acciones
```

#### Patrón Reducer
La aplicación utiliza el patrón Reducer para gestionar el estado complejo:
- **Estado inmutable**: Cada acción retorna un nuevo estado
- **Acciones tipadas**: TypeScript garantiza la integridad
- **Logging**: Sistema de logs para debugging

### Flujo de Datos

1. **Usuario interactúa** con formularios
2. **Dispatch de acciones** al reducer
3. **Estado actualizado** de forma inmutable
4. **Re-render automático** de componentes
5. **Generación de DBML** a partir del nuevo estado
6. **Llamada a API** para generar SVG
7. **Actualización del visor** con el nuevo diagrama

### API Backend (Astro)

#### Endpoint `/api/svg.ts`
```typescript
export const POST = async ({ request }: { request: Request }) => {
  const { dbml } = await request.json();
  const svg = run(dbml, 'svg'); // @softwaretechnik/dbml-renderer
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' }
  });
};
```

**Propósito**: Convierte código DBML a diagramas SVG usando el renderer especializado.

### Conversión de Formatos

#### Schema → DBML
La función `convertSchemaToDBML` transforma el estado interno a formato DBML:

```typescript
export function convertSchemaToDBML(schema: DBSchema) {
  const tablesPart = parseToDBML(schema);
  const fieldRelationships = extractRelationshipsFromFields(schema);
  const allRelationships = [...fieldRelationships, ...(schema.relationships || [])];
  const relationsPart = parseRelationshipsToDBML(allRelationships);
  return `${tablesPart}\n\n${relationsPart}`;
}
```

#### DBML → SQL
Utiliza `@dbml/core` para exportar a diferentes motores SQL:

```typescript
export function convertDBMLToSQL(dbml: string, sqlEngine: SupportedSQLEngine) {
  const sql = exporter.export(dbml, sqlEngine);
  return sql;
}
```

## 🎨 Componentes Clave

### 1. **App.tsx**
Componente raíz que proporciona el contexto global y estructura la aplicación en dos paneles.

### 2. **SchemaForm.tsx**
Panel de edición principal con sistema de tabs:
- Tab "Tablas": Gestión de tablas y campos
- Tab "Relaciones": Gestión de relaciones
- Estadísticas del esquema

### 3. **SVGExplorer.tsx**
Visor interactivo de diagramas con:
- **ReactSVGPanZoom**: Control de navegación
- **Estado de carga**: Feedback visual durante generación
- **Auto-zoom inteligente**: Ajuste automático al contenido
- **Gestión de eventos**: Mouse, teclado, redimensionamiento

### 4. **TableForm.tsx & FieldForm.tsx**
Formularios especializados para:
- **CRUD completo**: Crear, leer, actualizar, eliminar
- **Validación en tiempo real**: Feedback inmediato
- **UI compacta**: Maximiza espacio disponible
- **Estados de edición**: Modo agregar vs. editar

### 5. **ExportOptions.tsx**
Modal de exportación con:
- **Portal de React**: Renderizado fuera del árbol normal
- **Captura de pantalla**: html2canvas para imágenes
- **Descarga programática**: Generación dinámica de archivos
- **UI moderna**: Diseño con gradientes y animaciones

## 🔄 Flujo de Trabajo del Usuario

### Creación de Esquema
1. **Agregar tabla** nueva con nombre y descripción
2. **Añadir campos** especificando tipos y propiedades
3. **Establecer relaciones** entre tablas (opcional)
4. **Visualización automática** del diagrama generado

### Edición de Esquema
1. **Seleccionar elemento** (tabla, campo, relación)
2. **Modificar propiedades** en formularios intuitivos
3. **Confirmar cambios** con validación automática
4. **Actualización inmediata** del diagrama

### Exportación
1. **Abrir modal** de opciones de exportación
2. **Seleccionar formato** (imagen o SQL)
3. **Configurar opciones** específicas del formato
4. **Descargar o copiar** resultado

## 🛡️ Manejo de Errores y Validaciones

### Validaciones del Frontend
- **Nombres únicos**: Tablas y campos no pueden duplicarse
- **Campos obligatorios**: Validación de datos requeridos
- **Integridad referencial**: Las FK deben apuntar a campos existentes
- **Tipos de datos**: Validación de formatos según tipo seleccionado

### Manejo de Errores
- **Try/catch blocks**: Captura de errores en operaciones async
- **Feedback visual**: Mensajes de error claros para el usuario
- **Estado de carga**: Indicadores durante operaciones lentas
- **Fallbacks**: Comportamiento por defecto ante errores

## 🚀 Optimizaciones y Rendimiento

### Optimizaciones de React
- **useCallback/useMemo**: Prevención de re-renders innecesarios
- **Lazy loading**: Carga diferida de componentes pesados
- **Estado local vs global**: Minimización del estado compartido

### Optimizaciones de Renderizado
- **Debouncing**: Retraso en actualizaciones frecuentes
- **Timeout estratégico**: Suavizado de transiciones visuales
- **Gestión de memoria**: Limpieza de event listeners

### Optimizaciones de Red
- **Requests mínimos**: Una sola llamada por actualización
- **Compresión**: Minimización del payload DBML
- **Error handling**: Recuperación de fallos de red

## 🔧 Configuración y Desarrollo

### Scripts Disponibles
```json
{
  "dev": "astro dev",         // Servidor de desarrollo
  "build": "astro build",     // Build de producción
  "preview": "astro preview", // Vista previa del build
  "start": "node ./dist/server/entry.mjs" // Servidor de producción
}
```

### Configuración de Astro
- **Output**: Server-side rendering habilitado
- **Adaptador**: Node.js standalone
- **Integraciones**: React, Tailwind CSS
- **Prefetch**: Habilitado para mejor rendimiento

### Variables de Entorno
La aplicación no requiere variables de entorno específicas para funcionamiento básico.

## 📦 Dependencias Clave

### Dependencias de Producción
- **@astrojs/react**: Integración React en Astro
- **@dbml/core**: Parser y exportador DBML
- **@softwaretechnik/dbml-renderer**: Renderizado de diagramas
- **react-svg-pan-zoom**: Control de navegación SVG
- **html2canvas**: Captura de pantalla
- **tailwindcss**: Framework CSS

### Dependencias de Desarrollo
- **@types/react**: Tipos TypeScript para React
- **TypeScript**: Compilador y sistema de tipos

## 🐛 Debugging y Logging

### Sistema de Logs
La aplicación incluye logging detallado en:
- **Reducer actions**: Cada acción del reducer se registra
- **API calls**: Requests y responses
- **Errores**: Stack traces completos

### Herramientas de Desarrollo
- **React DevTools**: Inspección de componentes y estado
- **Browser DevTools**: Network, console, performance
- **TypeScript**: Detección de errores en tiempo de compilación

## 🔮 Extensibilidad

### Áreas de Extensión Futuras
1. **Nuevos tipos de campo**: Soporte para tipos específicos de SGBD
2. **Plantillas**: Esquemas predefinidos comunes
3. **Importación**: Carga desde archivos SQL existentes
4. **Colaboración**: Edición multi-usuario en tiempo real
5. **Versionado**: Control de cambios del esquema
6. **Índices**: Definición y visualización de índices
7. **Triggers y procedures**: Soporte para lógica avanzada

### Patrones de Extensión
- **Plugins**: Sistema modular para nuevas funcionalidades
- **Themes**: Personalización visual
- **Exporters**: Nuevos formatos de salida
- **Validators**: Reglas de validación personalizadas

## 📈 Métricas y Analítica

### Métricas del Esquema
La aplicación proporciona estadísticas básicas:
- **Número de tablas**: Conteo total
- **Número de relaciones**: Relaciones definidas
- **Campos por tabla**: Estadísticas de distribución

### Oportunidades de Analítica
- **Patrones de uso**: Tipos de campo más comunes
- **Complejidad**: Métricas de esquemas
- **Performance**: Tiempos de renderizado

## 🎯 Casos de Uso

### Educativo
- **Aprendizaje de BD**: Visualización de conceptos
- **Diseño de esquemas**: Práctica de modelado
- **Documentación**: Generación de diagramas para proyectos

### Profesional
- **Prototipado rápido**: Diseño inicial de BD
- **Documentación técnica**: Diagramas para equipos
- **Migración**: Planificación de cambios de esquema

### Personal
- **Proyectos personales**: Diseño de bases de datos
- **Portfolio**: Demostración de habilidades
- **Experimentación**: Pruebas de diseño

---

## 📄 Conclusión

El **Diagramador ER** es una herramienta completa y moderna para el diseño de bases de datos relacionales. Su arquitectura basada en React y TypeScript garantiza mantenibilidad y extensibilidad, mientras que su interfaz intuitiva permite tanto a principiantes como a expertos crear diagramas profesionales de manera eficiente.

La combinación de tecnologías modernas (Astro, React, TypeScript) con librerías especializadas (@dbml/core, react-svg-pan-zoom) resulta en una aplicación robusta que cubre todo el flujo de trabajo desde la conceptualización hasta la exportación de esquemas de base de datos.

*Última actualización: Agosto 2025*
