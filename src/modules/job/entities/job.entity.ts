import { BaseEntity } from 'src/modules/base'
import { Company } from 'src/modules/company/entities/company.entity'
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	Relation,
} from 'typeorm'
import { JobSkill } from './job-skill.entity'

@Entity('job')
export class Job extends BaseEntity {
    @Column()
    title: string

    @Column()
    location: string

    @Column({ default: false })
    remote: boolean

    @Column({ nullable: true })
    employment_type?: string

    @Column({ nullable: true })
    salary_min: number

    @Column({ nullable: true })
    salary_max: number

    @Column({ default: 'USD' })
    currency: string

    @Column({ nullable: true })
    company_id?: number

    @ManyToOne(() => Company, company => company.jobs, { eager: true })
    @JoinColumn({ name: 'company_id' })
    company: Company

    @Column({ nullable: true })
    experience: number

    @Column({ type: 'timestamp' })
    posted_date: Date

    @OneToMany(() => JobSkill, jobSkill => jobSkill.job, { cascade: true })
    jobSkills: Relation<JobSkill[]>
}
