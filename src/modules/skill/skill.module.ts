import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { SkillController } from './skill.controller'
import { SkillService } from './skill.service'

@Module({
    imports: [DatabaseModule],
    controllers: [SkillController],
    providers: [SkillService],
})
export class SkillModule {}
