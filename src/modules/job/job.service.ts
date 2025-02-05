import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { catchError, firstValueFrom, map } from 'rxjs'
import { Repository } from 'typeorm'
import { BaseService } from '../base'
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
        this.fetchData()
    }

    // findAll(query: QueryParams<Job>): Promise<FindAll<Job>> {}\

    async fetchData() {
        const dataOne = await this.fetchDataOne()
        const dataTwo = await this.fetchDataTwo()
        const data = [
            ...(Array.isArray(dataOne) ? dataOne : []),
            ...(Array.isArray(dataTwo) ? dataTwo : []),
        ]
    }

    async insertData(data: BaseJob[]) {}
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
}
