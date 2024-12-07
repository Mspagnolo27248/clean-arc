import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initializeDb() {
  const dbPath = path.join('./', 'database.sqlite');
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}