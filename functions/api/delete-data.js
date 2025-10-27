export async function onRequestDelete({ request, env }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const userId = url.searchParams.get('userId');
  await env.TABUNGAN_DB.prepare(
    `DELETE FROM tabungan WHERE id = ? AND user_id = ?`
  ).bind(id, userId).run();
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
