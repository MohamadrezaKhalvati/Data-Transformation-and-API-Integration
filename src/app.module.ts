import { Module } from '@nestjs/common'
import { CompanyModule } from './modules/company/company.module'
import { JobModule } from './modules/job/job.module'
import { SkillModule } from './modules/skill/skill.module'

@Module({
    imports: [CompanyModule, SkillModule, JobModule],
})
export class AppModule {}
