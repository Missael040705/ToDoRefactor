// Express server for ToDoRefactor
const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const host = process.env.HOST || '127.0.0.1';

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_wh1ekAfj7ZDV@ep-falling-surf-amiqx6ks-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channelBinding=require';

// PostgreSQL connection
const pool = new Pool({connectionString});

app.use(cors());
app.use(express.json());

// Helper: Normalize and validate task fields
function normalizeText(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function validateTaskFields(task) {
    const title = normalizeText(task.title);
    const owner = normalizeText(task.owner);
    const description = normalizeText(task.description);

    if (!title || !owner || !description) {
        return null;
    }

    return {title, owner, description};
}

function parseId(idParam) {
    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }
    return id;
}

// GET /api/tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const result = await pool.query('select * from tasks order by id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error: 'Database error', details: err.message});
    }
});

// POST /api/tasks
app.post('/api/tasks', async (req, res) => {
    const validated = validateTaskFields(req.body);
    if (!validated) {
        return res.status(400).json({error: 'title, owner y description son obligatorios'});
    }

    const {title, owner, description} = validated;

    try {
        const result = await pool.query(
            'insert into tasks (title, owner, description) values ($1, $2, $3) RETURNING *',
            [title, owner, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: 'Database error', details: err.message});
    }
});

// PUT /api/tasks/:id
app.put('/api/tasks/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({error: 'ID de tarea invalido'});
    }

    const validated = validateTaskFields(req.body);
    if (!validated) {
        return res.status(400).json({error: 'title, owner y description son obligatorios'});
    }

    const completed = typeof req.body.completed === 'boolean' ? req.body.completed : false;
    const {title, owner, description} = validated;

    try {
        const result = await pool.query(
            'update tasks set title=$1, owner=$2, description=$3, completed=$4 where id=$5 RETURNING *',
            [title, owner, description, completed, id]
        );
        if (result.rowCount === 0) return res.status(404).json({error: 'Task not found'});
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: 'Database error', details: err.message});
    }
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({error: 'ID de tarea invalido'});
    }

    try {
        const result = await pool.query('delete from tasks where id=$1 RETURNING *', [id]);
        if (result.rowCount === 0) return res.status(404).json({error: 'Task not found'});
        res.json({success: true});
    } catch (err) {
        res.status(500).json({error: 'Database error', details: err.message});
    }
});

app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
});
