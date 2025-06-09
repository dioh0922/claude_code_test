require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 3000;

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql'
});

const Techlist = sequelize.define('Techlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'techlist',
  timestamps: false
});

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/list', (req, res) => {
  res.sendFile(__dirname + '/list.html');
});

app.get('/api/list', async (req, res) => {
  try {
    const techlist = await Techlist.findAll();
    res.json({ items: techlist });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch techlist data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});