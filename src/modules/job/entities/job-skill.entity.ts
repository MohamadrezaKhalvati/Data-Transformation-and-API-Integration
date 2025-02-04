import { BaseEntity } from 'src/modules/base'
import { Skill } from 'src/modules/skill/entities/skill.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Job } from './job.entity'

@Entity('job_skills')
export class JobSkill extends BaseEntity {
    @Column()
    job_id: number

    @Column()
    skill_id: number

    @ManyToOne(() => Job, job => job.jobSkills, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'job_id' })
    job: Job

    @ManyToOne(() => Skill, skill => skill.jobSkills, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'skill_id' })
    skill: Skill
}
