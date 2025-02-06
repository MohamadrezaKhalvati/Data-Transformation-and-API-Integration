import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CompanyService } from './company.service'

@Module({
    imports: [DatabaseModule],
    controllers: [],
    providers: [CompanyService],
})
export class CompanyModule {}
