import { HttpModule } from '@nestjs/axios'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ThrottlerModule } from '@nestjs/throttler'
import * as path from 'path'
import { DatabaseModule } from '../database/database.module'

import { UtilsService } from './utils.service'
@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        HttpModule.register({ timeout: 60000 }),
        ThrottlerModule.forRoot([{ ttl: 60, limit: 150 }]),
        CacheModule.register(),
        MulterModule.register({
            dest: __dirname + '../upload',
        }),
        ScheduleModule.forRoot(),
        ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, '../..', 'public'),
            serveRoot: '/public',
        }),
    ],
    providers: [UtilsService],
    exports: [UtilsService],
})
export class UtilsModule {}
