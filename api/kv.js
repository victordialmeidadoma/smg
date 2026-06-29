const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const { key, prefix } = req.query;

      if (key) {
        const { data, error } = await supabase
          .from('kv_store')
          .select('value')
          .eq('key', key)
          .maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'not_found' });
        return res.status(200).json({ key, value: data.value });
      }

      if (prefix !== undefined) {
        const { data, error } = await supabase
          .from('kv_store')
          .select('key')
          .ilike('key', prefix + '%');
        if (error) throw error;
        return res.status(200).json({ keys: data.map(r => r.key) });
      }

      return res.status(400).json({ error: 'informe key ou prefix' });
    }

    if (req.method === 'POST') {
      const { key, value } = req.body || {};
      if (!key) return res.status(400).json({ error: 'campo key é obrigatório' });

      const { error } = await supabase
        .from('kv_store')
        .upsert({ key, value, updated_at: new Date().toISOString() });
      if (error) throw error;

      return res.status(200).json({ key, value });
    }

    if (req.method === 'DELETE') {
      const { key } = req.query;
      if (!key) return res.status(400).json({ error: 'informe key' });

      const { error } = await supabase.from('kv_store').delete().eq('key', key);
      if (error) throw error;

      return res.status(200).json({ key, deleted: true });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'método não permitido' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'erro interno' });
  }
};
