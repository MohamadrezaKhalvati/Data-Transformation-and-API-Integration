import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { catchError, firstValueFrom, map } from 'rxjs'
import { FindOptionsWhere, Repository } from 'typeorm'
import { BaseService, QueryBuilderParams } from '../base'
import { Company } from '../company/entities/company.entity'
import { Skill } from '../skill/entities/skill.entity'
import ApiOneMapper from '../utils/mapper/provider-one.mapper'
import ApiTwoMapper from '../utils/mapper/provider-two.mapper'
import { BaseJob } from '../utils/types/data-transformed.type'
import { ApiOneResponse } from '../utils/types/ProviderOneRes.type'
import { ApiTwoResponse } from '../utils/types/ProviderTwoRes.type'
import { JobSkill } from './entities/job-skill.entity'
import { Job } from './entities/job.entity'
@Injectable()
export class JobService extends BaseService<Job> {
    private readonly logger = new Logger(JobService.name)
    private readonly apiProviderOne
    private readonly apiProviderTwo
    constructor(
        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,

        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        @InjectRepository(Skill)
        private readonly skillRepository: Repository<Skill>,
        @InjectRepository(JobSkill)
        private readonly JobSkillRepository: Repository<JobSkill>,

        private readonly httpService: HttpService,
    ) {
        super(jobRepository)
        this.apiProviderOne = process.env.API_PROVIDER_ONE
        this.apiProviderTwo = process.env.API_PROVIDER_TWO
    }

    async findAllQb(query: QueryBuilderParams<Job>) {
        const filter = query.filter as FindOptionsWhere<Job>
        const qb = this.jobRepository.createQueryBuilder('job')

        ;[
            'title',
            'location',
            'remote',
            'employment_type',
            'salary_min',
            'salary_max',
            'currency',
            'company',
            'experience',
            'skill',
            'website',
            'industry',
        ].forEach(field => {
            if (
                !filter[field] ||
                (Array.isArray(filter[field]) && filter[field].length === 0) ||
                filter[field].toString().length === 0
            ) {
                delete filter[field]
            }
        })

        qb.leftJoinAndSelect('job.company', 'company')
            .leftJoinAndSelect('job.jobSkills', 'job_skills')
            .leftJoinAndSelect('jobSkills', 'skill')

        if (filter?.title) {
            qb.andWhere('job.title LIKE :title', {
                title: `%${filter.title}%`,
            })
        }

        if (filter?.location) {
            qb.andWhere('job.location LIKE :location', {
                location: `%${filter.location}%`,
            })
        }

        if (filter?.remote !== undefined) {
            qb.andWhere('job.remote = :remote', {
                remote: filter.remote,
            })
        }

        if (filter?.employment_type) {
            qb.andWhere('job.employment_type = :employment_type', {
                employment_type: filter.employment_type,
            })
        }

        if (filter?.salary_min) {
            qb.andWhere('job.salary_min >= :salary_min', {
                salary_min: filter.salary_min,
            })
        }

        if (filter?.salary_max) {
            qb.andWhere('job.salary_max <= :salary_max', {
                salary_max: filter.salary_max,
            })
        }

        if (filter?.currency) {
            qb.andWhere('job.currency = :currency', {
                currency: filter.currency,
            })
        }

        if (filter?.company) {
            qb.andWhere('company.name LIKE :company', {
                company: `%${filter.company}%`,
            })
        }

        if (filter?.experience) {
            qb.andWhere('job.experience = :experience', {
                experience: filter.experience,
            })
        }

        //@ts-expect-error
        if (filter?.skill) {
            qb.andWhere('skill.name LIKE :skill', {
                //@ts-expect-error
                skill: `%${filter.skill}%`,
            })
        }
        //@ts-expect-error
        if (filter?.website) {
            qb.andWhere('company.website LIKE :website', {
                //@ts-expect-error
                website: `%${filter.website}%`,
            })
        }
        //@ts-expect-error
        if (filter?.industry) {
            qb.andWhere('company.industry LIKE :industry', {
                //@ts-expect-error
                industry: `%${filter.industry}%`,
            })
        }

        return await super.findAllQueryBuilder(
            {
                page: query.page,
                take: query.take,
                sort: query.sort,
            },
            qb,
        )
    }

    async insertData(data: BaseJob[]) {
        data.forEach(async job => {
            const skill_ids = []
            let company_id
            job.skills.forEach(async skillItem => {
                const existSkill = await this.skillRepository.findOne({
                    where: { name: skillItem },
                })
                if (!existSkill) {
                    const skill = await this.skillRepository
                        .create({ name: skillItem })
                        .save()
                    skill_ids.push(skill.id)
                    this.logger.verbose(`Skill ${skill} Created.`)
                } else {
                    skill_ids.push(existSkill.id)
                }
            })

            const existCompany = await this.companyRepository.findOne({
                where: { name: job.companyName },
            })
            if (!existCompany) {
                const company = await this.companyRepository
                    .create({
                        name: job.companyName,
                        website: job.website,
                        industry: job.industry,
                    })
                    .save()
                company_id = company.id
                this.logger.verbose(`Company ${job.companyName} Created.`)
            } else {
                company_id = existCompany.id
            }

            const newJob = await this.jobRepository
                .create({
                    title: job.title,
                    company_id: company_id,
                    currency: job.currency,
                    experience: job.experience,
                    location: job.location,
                    posted_date: job.postedDate,
                    remote: job.remote,
                    salary_min: job.salaryMin,
                    salary_max: job.salaryMax,
                    employment_type: job.employmentType,
                })
                .save()
            this.logger.verbose(`Job ${job.title} Created.`)

            skill_ids.forEach(async skill_id => {
                await this.JobSkillRepository.create({
                    skill_id: skill_id,
                    job_id: newJob.id,
                }).save()
            })
        })
    }
    async fetchDataOne(): Promise<BaseJob[]> {
        return await firstValueFrom(
            this.httpService.get<ApiOneResponse>(this.apiProviderOne).pipe(
                map(response => {
                    return ApiOneMapper.mapResponse(response.data)
                }),
                catchError(error => {
                    Logger.error(error)
                    throw error
                }),
            ),
        )
    }

    async fetchDataTwo(): Promise<BaseJob[]> {
        return await firstValueFrom(
            this.httpService.get<ApiTwoResponse>(this.apiProviderTwo).pipe(
                map(response => {
                    return ApiTwoMapper.mapResponse(response.data)
                }),
                catchError(error => {
                    Logger.error(error)
                    throw error
                }),
            ),
        )
    }

    @Cron(process.env.CRON_SCHEDULE || CronExpression.EVERY_10_SECONDS)
    async fetchData() {
        this.logger.debug('Cron Job Has Started')
        const dataOne = await this.fetchDataOne()
        const dataTwo = await this.fetchDataTwo()
        const data = [
            ...(Array.isArray(dataOne) ? dataOne : []),
            ...(Array.isArray(dataTwo) ? dataTwo : []),
        ]
        await this.insertData(data)
        this.logger.debug('Cron Job Has Finished')
    }
}
