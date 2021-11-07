import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

global.beforeEach(async () => {
  // delete the database before each test
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
});

global.afterEach(async () => {
  // close the connection to the database after each test
  const connection = getConnection();
  await connection.close();
});

// The session test is located in Sectie 14: Managing App Configuration - A followup Test
