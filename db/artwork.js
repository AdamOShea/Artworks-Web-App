const {getDatabase} = require('./mongo');
const {ObjectId} = require('mongodb');
const fs = require('fs');

const collectionName = 'artworks';

function sanitizeKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeKeys);
  } else if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, val]) => {
      const safeKey = key.replace(/[^\w]/g, '_');
      acc[safeKey] = sanitizeKeys(val);
      return acc;
    }, {});
  }
  return obj;
}

async function insertArtworkFromFile(path) {
    const rawData = JSON.parse(fs.readFileSync(path, 'utf8'));
    const artworksArray = Array.isArray(rawData) ? rawData : [rawData];
    const sanitizedArtworks = artworksArray.map(sanitizeKeys);
  
    const db = await getDatabase();
    await db.collection(collectionName).insertMany(sanitizedArtworks);
}
  
async function insertArtwork(artwork) {
    const db = await getDatabase();
    const sanitized = sanitizeKeys(artwork); 
    const { insertedId } = await db.collection('artworks').insertOne(sanitized);
    return insertedId;
}
  
async function updateArtwork(id, updates) {
    const db = await getDatabase();
    const result = await db.collection('artworks').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    return result;
}
  
async function deleteArtwork(id) {
    const db = await getDatabase();
    await db.collection('artworks').deleteOne({ _id: new ObjectId(id) });
}

async function getArtworks() {
  const db = await getDatabase();
  const collection = db.collection('artworks');
  return await collection.find({}).toArray();
}

module.exports = {
  insertArtwork,
  insertArtworkFromFile,
  getArtworks,
  updateArtwork,
  deleteArtwork
};
