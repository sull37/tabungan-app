export async function onRequestPost({ request, env }) {
  const { target, userId } = await request.json();
  await env.TABUNGAN_DB.prepare(
    `INSERT OR REPLACE INTO targets (user_id, target_amount) VALUES (?, ?)`
  ).bind(userId, target).run();
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
