export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const { results } = await env.TABUNGAN_DB.prepare(
    `SELECT * FROM tabungan WHERE user_id = ? ORDER BY created_at DESC`
  ).bind(userId).all();
  return new Response(JSON.stringify(results), { status: 200 });
}
