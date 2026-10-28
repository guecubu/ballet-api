const express = require('express');
const app = express();

const b1 = require('../ballets_1_15.json');
const b2 = require('../ballets_16_30.json');
const b3 = require('../ballets_31_45.json');
const b4 = require('../ballets_46_60.json');

const balletsData = [...b1, ...b2, ...b3, ...b4];

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: "online", total_ballets: balletsData.length });
});

app.get('/api/ballets', (req, res) => {
  const parsedLimit = parseInt(req.query.limit, 10);
  const limit = Number.isNaN(parsedLimit) || parsedLimit < 0 ? 0 : parsedLimit;

  const list = balletsData.map(b => ({
    id: b.id,
    title: b.title,
    composer: b.composer,
    premiere_year: b.premiere_year,
    cover_image: b.multimedia ? b.multimedia.cover_image_url : null
  }));

  res.json(limit > 0 ? list.slice(0, limit) : list);
});

app.get('/api/ballets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const ballet = balletsData.find(b => b.id === id);
  if (!ballet) {
    return res.status(404).json({ error: "Ballet not found" });
  }
  res.json(ballet);
});

module.exports = app;
