import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { DatabaseModule } from '../database/database.module'

import { UtilsService } from './utils.service'
@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        HttpModule.register({ timeout: 60000 }),
        ScheduleModule.forRoot(),
    ],
    providers: [UtilsService],
    exports: [UtilsService],
})
export class UtilsModule {}
