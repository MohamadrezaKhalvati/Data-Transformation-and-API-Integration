import { BaseEntity } from 'src/modules/base'
import { Job } from 'src/modules/job/entities/job.entity'
import { Column, Entity, OneToMany, Relation } from 'typeorm'

@Entity('company')
export class Company extends BaseEntity {
    @Column({ unique: true })
    name: string

    @Column({ nullable: true })
    industry: string

    @Column({ nullable: true })
    website?: string

    @OneToMany('Job', 'company')
    jobs: Relation<Job[]>
}
