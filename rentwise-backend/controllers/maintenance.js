const db = require('../db');

exports.getAll = async (req, res) => {
  try {
    const result = await db.query(`SELECT m.*, t.full_name as tenant_name, pr.title as property_title FROM maintenance_requests m JOIN tenants t ON m.tenant_id = t.id JOIN properties pr ON m.property_id = pr.id ORDER BY m.created_at DESC`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { tenant_id, property_id, title, description, priority, status } = req.body;
    if (!tenant_id || !property_id || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await db.query(
      `INSERT INTO maintenance_requests (tenant_id, property_id, title, description, priority, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [tenant_id, property_id, title, description, priority || 'Low', status || 'Pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM maintenance_requests WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status } = req.body;
    const result = await db.query(
      `UPDATE maintenance_requests SET title = COALESCE($1, title), description = COALESCE($2, description), priority = COALESCE($3, priority), status = COALESCE($4, status) WHERE id = $5 RETURNING *`,
      [title, description, priority, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM maintenance_requests WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
