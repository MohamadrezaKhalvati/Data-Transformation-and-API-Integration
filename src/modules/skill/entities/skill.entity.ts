import { BaseEntity } from 'src/modules/base'
import { JobSkill } from 'src/modules/job/entities/job-skill.entity'
import { Column, Entity, OneToMany } from 'typeorm'

@Entity('skill')
export class Skill extends BaseEntity {
    @Column({ unique: true })
    name: string

    @OneToMany(() => JobSkill, jobSkill => jobSkill.skill)
    jobSkills: JobSkill[]
}
