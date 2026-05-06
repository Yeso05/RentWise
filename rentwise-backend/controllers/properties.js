const db = require('../db');

exports.getAll = async (req, res) => {
  try {
    const { email } = req.query;
    if (email) {
      const result = await db.query(
        'SELECT * FROM properties WHERE landlord_email = $1 ORDER BY created_at DESC',
        [email]
      );
      res.json(result.rows);
    } else {
      const result = await db.query('SELECT * FROM properties ORDER BY created_at DESC');
      res.json(result.rows);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, location, rent, status, landlord_email } = req.body;
    if (!title || !location || !rent || !landlord_email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await db.query(
      `INSERT INTO properties (title, location, rent, status, landlord_email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, location, rent, status || 'vacant', landlord_email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM properties WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, location, rent, status } = req.body;
    const result = await db.query(
      `UPDATE properties SET title = COALESCE($1, title), location = COALESCE($2, location), rent = COALESCE($3, rent), status = COALESCE($4, status) WHERE id = $5 RETURNING *`,
      [title, location, rent, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM properties WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
