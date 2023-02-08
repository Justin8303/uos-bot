// /lib/dbConnect.js
import mongoose from 'mongoose'
import * as dotenv from "dotenv";

/**
 Source :
 https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/utils/dbConnect.js
 **/


dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
let cached = global.mongoose

if (!cached) {
    // @ts-ignore
    cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect () {
    if (!MONGODB_URI) {
        throw new Error(
            'Please define the MONGODB_URI environment variable inside .env.local'
        )
    }

    // @ts-ignore
    if (cached.conn) {
        // @ts-ignore
        return cached.conn
    }

    // @ts-ignore
    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
        }

        // @ts-ignore
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
            return mongoose
        })
    }

    // @ts-ignore
    cached.conn = await cached.promise
    // @ts-ignore
    return cached.conn
}

export default dbConnect