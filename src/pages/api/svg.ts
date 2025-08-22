import { run } from '@softwaretechnik/dbml-renderer'

export const prerender = false; // Desactiva el prerenderizado para este endpoint

export const POST = async ({ request }: { request: Request }) => {
  try {
    const { dbml } = await request.json();

    if (!dbml) {
      return new Response(
        JSON.stringify({ error: 'El código DBML es requerido.' }),
        { status: 400 }
      );
    }

    const svg = run(dbml, 'svg')

    console.log(svg)

    return new Response(svg, {
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Hubo un error al generar el diagrama.' }),
      { status: 500 }
    );
  }
};
