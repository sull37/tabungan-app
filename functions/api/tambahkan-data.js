export async function onRequestPost({ request, env }) {
  const { bulan, mas, adek, userId } = await request.json();
  const total = mas + adek;
  await env.TABUNGAN_DB.prepare(
    `INSERT INTO tabungan (user_id, bulan, mas, adek, total) VALUES (?, ?, ?, ?, ?)`
  ).bind(userId, bulan, mas, adek, total).run();
  return new Response(JSON.stringify({ success: true, total }), { status: 200 });
}
