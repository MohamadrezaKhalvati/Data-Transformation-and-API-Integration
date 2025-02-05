import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { JobController } from './job.controller'
import { JobService } from './job.service'

@Module({
    imports: [DatabaseModule, HttpModule.register({ timeout: 10000 })],
    controllers: [JobController],
    providers: [JobService],
})
export class JobModule {}
