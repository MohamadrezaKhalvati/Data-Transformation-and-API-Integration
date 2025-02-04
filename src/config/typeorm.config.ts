import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface'
import { config as dotenvConfig } from 'dotenv'
import * as path from 'path'
import { ClientConfig } from 'pg'
import { TypeOrmModels } from 'src/config/entities.array'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SeederOptions } from 'typeorm-extension'

dotenvConfig({ path: '.env' })
export const databaseConfig: TypeOrmModuleOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    entities: TypeOrmModels,
    migrations: [path.join(__dirname, '../database/migrations/*{.js,.ts}')],
    seeds: ['src/database/seeder/seeds/**/*{.ts,.js}'],
    factories: ['src/database/seeder/factories/**/*{.ts,.js}'],
    logging: false,
}

export const testDatabaseConfig: ClientConfig = {
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    logging: false,
}
export const dataSource = new DataSource(databaseConfig as DataSourceOptions)
