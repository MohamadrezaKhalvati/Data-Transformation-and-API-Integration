import { Company } from 'src/modules/company/entities/company.entity'
import { JobSkill } from 'src/modules/job/entities/job-skill.entity'
import { Job } from 'src/modules/job/entities/job.entity'
import { Skill } from 'src/modules/skill/entities/skill.entity'

export const TypeOrmModels = [Company, Job, JobSkill, Skill]
