// Ejemplo de cómo deben funcionar las relaciones

// ESCENARIO: 
// - Tabla "users" con PK "id"
// - Tabla "posts" con FK "user_id" que referencia a "users.id"

// ANTES (incorrecto):
// Ref: posts.user_id > users.id 
// Esto significa: "muchos posts van hacia un user" ❌

// DESPUÉS (correcto):
// Ref: users.id < posts.user_id
// Esto significa: "un user tiene muchos posts" ✅

// EXPLICACIÓN VISUAL:
// users.id ←─────── posts.user_id
//    (1)              (muchos)
//
// La flecha/pata de gallo (←) indica que:
// - UN usuario puede tener MUCHOS posts
// - MUCHOS posts pertenecen a UN usuario

export const relationshipExamples = {
  oneToMany: {
    description: "Un usuario tiene muchos posts",
    dbml: "Ref: users.id < posts.user_id",
    visual: "users.id ←─────── posts.user_id"
  },
  
  manyToOne: {
    description: "Muchos posts pertenecen a un usuario (vista desde posts)",
    dbml: "Ref: posts.user_id > users.id", 
    visual: "posts.user_id ─────────→ users.id"
  },
  
  oneToOne: {
    description: "Un usuario tiene un perfil",
    dbml: "Ref: users.id - profiles.user_id",
    visual: "users.id ─────────── profiles.user_id"
  },
  
  manyToMany: {
    description: "Muchos usuarios tienen muchos roles",
    dbml: "Ref: users.id >< user_roles.user_id",
    visual: "users.id ←─────────→ user_roles.user_id"
  }
};
