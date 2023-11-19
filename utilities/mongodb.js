import { MongoClient } from 'mongodb';

let client;

export async function connectDatabase() {
  if (client) {
    console.log("already connected");
    return;
  }

  console.log("new connected");

  client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
  } catch (error) {
    console.error('Failed to connect to the database', error);
    throw new Error('Failed to connect to the database');
  }
}

export async function getDb() {
  if (!client) {
    throw new Error('You have to connect to the database first.');
  }
  return client.db('BusinessMasterlistDatabase');
}

// Add a function to get the 'BusinessReviews' collection
export async function getBusinessReviewsCollection() {
  const db = await getDb();
  return db.collection('BusinessReviews');
}

// Add a function to get the 'VerificationCodes' collection
export async function getVerificationCodesCollection() {
  const db = await getDb();
  return db.collection('VerificationCodes');
}

// Add a function to get the 'ClickData' collection
export async function getClickDataCollection() {
  const db = await getDb();
  return db.collection('ClickData');
}

// Add this function to your existing MongoDB utility file
export async function getUsersCollection() {
  const db = await getDb();
  return db.collection('Users');
}

// Add a function to insert click data
export async function insertClickData(data) {
  const clickDataCollection = await getClickDataCollection();
  try {
    const result = await clickDataCollection.insertOne(data);
    return result;
  } catch (error) {
    console.error('Failed to insert click data', error);
    throw new Error('Failed to insert click data');
  }
}
