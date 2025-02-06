import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { SkillService } from './skill.service'

@Module({
    imports: [DatabaseModule],
    controllers: [],
    providers: [SkillService],
})
export class SkillModule {}
