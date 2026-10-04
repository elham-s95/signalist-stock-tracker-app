import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const maskUri = (uri: string) =>
  uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');

export const connectToDatabase = async () => {
  if (!MONGODB_URI)
    throw new Error('MONGODB_URI must be set within .env.local');

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(
      `Connected to database (${process.env.NODE_ENV}) - ${maskUri(MONGODB_URI)}`,
    );
  }

  return cached.conn;
};
