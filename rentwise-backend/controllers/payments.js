const db = require('../db');

exports.getAll = async (req, res) => {
  try {
    const { email, status } = req.query;
    let query = 'SELECT p.*, t.full_name as tenant_name, pr.title as property_title FROM payments p JOIN tenants t ON p.tenant_id = t.id JOIN properties pr ON p.property_id = pr.id';
    const params = [];
    if (status) {
      query += ' WHERE p.status = $1';
      params.push(status);
    }
    query += ' ORDER BY p.created_at DESC';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { tenant_id, property_id, amount, due_date, status } = req.body;
    if (!tenant_id || !property_id || !amount || !due_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await db.query(
      `INSERT INTO payments (tenant_id, property_id, amount, due_date, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tenant_id, property_id, amount, due_date, status || 'Pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM payments WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paid_date } = req.body;
    const result = await db.query(
      `UPDATE payments SET status = COALESCE($1, status), paid_date = COALESCE($2, paid_date) WHERE id = $3 RETURNING *`,
      [status, paid_date, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM payments WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
