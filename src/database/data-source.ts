import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config as loadEnv } from 'dotenv';

loadEnv();

const databaseUrl = process.env.DATABASE_URL;

const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: ['dist/entities/**/*.entity.{ts,js}'],
  migrations: ['dist/database/migrations/*.{ts,js}'],
  ssl: false,
  logging: false,
});

export default AppDataSource;
