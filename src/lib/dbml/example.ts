export const dbExampleSchema = {
  tables: [
    {
      name: "users",
      note: "Tabla de usuarios del sistema",
      fields: [
        { name: "id", type: "int", pk: true, notNull: true, autoIncrement: true },
        { name: "username", type: "varchar(50)", unique: true, notNull: true },
        { name: "email", type: "varchar(100)", notNull: true },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "posts",
      note: "Publicaciones hechas por usuarios",
      fields: [
        { name: "id", type: "int", pk: true, autoIncrement: true },
        { name: "user_id", type: "int", notNull: true, references: { table: "users", field: "id" } },
        { name: "title", type: "varchar(200)", notNull: true },
        { name: "content", type: "text" },
        { name: "published_at", type: "timestamp" }
      ]
    },
    {
      name: "comments",
      note: "Comentarios en las publicaciones",
      fields: [
        { name: "id", type: "int", pk: true, autoIncrement: true },
        { name: "post_id", type: "int", notNull: true, references: { table: "posts", field: "id" } },
        { name: "user_id", type: "int", notNull: true, references: { table: "users", field: "id" } },
        { name: "content", type: "text", notNull: true },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "likes",
      note: "Me gusta en las publicaciones",
      fields: [
        { name: "id", type: "int", pk: true, autoIncrement: true },
        { name: "post_id", type: "int", notNull: true, references: { table: "posts", field: "id" } },
        { name: "user_id", type: "int", notNull: true, references: { table: "users", field: "id" } },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" }
      ]
    }

  ]
};
