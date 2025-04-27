const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const { startDatabase, getDatabase } = require('./db/mongo');
const { ObjectId } = require('mongodb');
const { insertArtworkFromFile, insertArtwork, getArtworks, updateArtwork, deleteArtwork } = require('./db/artwork');
const app = express();
const maxListenersExceededWarning = require('max-listeners-exceeded-warning');
 
maxListenersExceededWarning();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(helmet());
app.use(bodyParser.json());

app.use(morgan('combined'));

app.post('/artworks', async (req, res) => {
    try {
      const id = await insertArtwork(req.body);
      res.status(201).send({ message: 'Artwork added', id });
    } catch (err) {
      res.status(500).send({ error: 'Failed to insert artwork' });
    }
});
  

app.put('/artworks/:id', async (req, res) => {
    try {
      const result = await updateArtwork(req.params.id, req.body);
      res.send({ message: 'Artwork updated', result });
    } catch (err) {
      res.status(500).send({ error: 'Failed to update artwork' });
    }
});

app.delete('/artworks/:id', async (req, res) => {
    try {
      await deleteArtwork(req.params.id);
      res.send({ message: 'Artwork deleted' });
    } catch (err) {
      res.status(500).send({ error: 'Failed to delete artwork' });
    }
});


app.get('/artworks', async (req, res) => {
  try {
    const artworks = await getArtworks();
    res.status(200).send(artworks);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch artworks' });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await getDatabase();
    const existing = await db.collection('users').findOne({ username });
    if (existing) return res.status(400).send({ error: 'Username already taken' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection('users').insertOne({ username, password: hashedPassword, savedArtworks: [] });
    res.status(201).send({ message: 'User registered successfully', userId: result.insertedId });

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await getDatabase();
    const user = await db.collection('users').findOne({ username });
    if (!user) return res.status(400).send({ error: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ error: 'Invalid username or password' });

    res.send({ message: 'Login successful', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Login failed' });
  }
});


app.post('/users/:userId/save-artwork', async (req, res) => {
  try {
    const { userId } = req.params;
    const { artworkId } = req.body;
    const db = await getDatabase();

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).send({ error: 'User not found' });

    if (user.savedArtworks.includes(artworkId)) {
      return res.status(400).send({ error: 'Artwork already saved' });
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $push: { savedArtworks: artworkId } }
    );

    res.send({ message: 'Artwork saved to user account' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Could not save artwork' });
  }
});

app.post('/users/:userId/unsave-artwork', async (req, res) => {
  try {
    const { userId } = req.params;
    const { artworkId } = req.body;
    const db = await getDatabase();

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).send({ error: 'User not found' });

    if (!user.savedArtworks.includes(artworkId)) {
      return res.status(400).send({ error: 'Artwork not found in saved list' });
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { savedArtworks: artworkId } }
    );

    res.send({ message: 'Artwork removed from user account' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Could not unsave artwork' });
  }
});



app.get('/users/:userId/saved-artworks', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = await getDatabase();

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).send({ error: 'User not found' });

    const artworks = await db.collection('artworks')
      .find({ _id: { $in: user.savedArtworks.map(id => new ObjectId(id)) } })
      .toArray();

    res.send(artworks);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to retrieve saved artworks' });
  }
});

startDatabase().then(async () => {
  await insertArtworkFromFile('./Artworks.json');

  app.listen(3001, () => {
    console.log('Server listening on port 3001');
  });
});
