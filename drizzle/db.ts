import * as schema from './schemas'
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!,{max:1})

const db = drizzle(client,{schema});
export default db;
