import { HttpService } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { QueryBuilderParams } from '../base'
import { Company } from '../company/entities/company.entity'
import { Skill } from '../skill/entities/skill.entity'
import { JobSkill } from './entities/job-skill.entity'
import { Job } from './entities/job.entity'
import { JobService } from './job.service'

describe('JobService', () => {
    let service: JobService
    let jobRepository: any
    let companyRepository: any
    let skillRepository: any
    let jobSkillRepository: any
    let httpService: HttpService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JobService,
                {
                    provide: getRepositoryToken(Job),
                    useValue: {
                        createQueryBuilder: jest.fn().mockReturnValue({
                            leftJoinAndSelect: jest.fn().mockReturnThis(),
                            andWhere: jest.fn().mockReturnThis(),
                            offset: jest.fn().mockReturnThis(),
                            take: jest.fn().mockReturnThis(),
                            orderBy: jest.fn().mockReturnThis(),
                            getMany: jest.fn().mockResolvedValue([]),
                            getCount: jest.fn().mockResolvedValue(0),
                        }),
                        create: jest.fn().mockImplementation(data => ({
                            ...data,
                            save: jest.fn().mockResolvedValue(data),
                        })),
                        save: jest
                            .fn()
                            .mockImplementation(data => Promise.resolve(data)),
                        update: jest.fn().mockResolvedValue({}),
                        findOne: jest.fn().mockResolvedValue(null),
                    },
                },
                {
                    provide: getRepositoryToken(Company),
                    useValue: {
                        findOne: jest.fn().mockResolvedValue(null),
                        create: jest.fn().mockImplementation(data => ({
                            ...data,
                            save: jest
                                .fn()
                                .mockResolvedValue({ id: 1, ...data }),
                        })),
                    },
                },
                {
                    provide: getRepositoryToken(Skill),
                    useValue: {
                        findOne: jest.fn().mockResolvedValue(null),
                        create: jest.fn().mockImplementation(data => ({
                            ...data,
                            save: jest.fn().mockResolvedValue({
                                id: Math.floor(Math.random() * 1000),
                                ...data,
                            }),
                        })),
                    },
                },
                {
                    provide: getRepositoryToken(JobSkill),
                    useValue: {
                        create: jest.fn().mockImplementation(data => ({
                            ...data,
                            save: jest.fn().mockResolvedValue(data),
                        })),
                    },
                },
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile()

        service = module.get<JobService>(JobService)
        jobRepository = module.get(getRepositoryToken(Job))
        companyRepository = module.get(getRepositoryToken(Company))
        skillRepository = module.get(getRepositoryToken(Skill))
        jobSkillRepository = module.get(getRepositoryToken(JobSkill))
        httpService = module.get<HttpService>(HttpService)
    })

    it('should be defined', () => {
        expect(jobRepository).toBeDefined()
        expect(companyRepository).toBeDefined()
        expect(skillRepository).toBeDefined()
        expect(jobSkillRepository).toBeDefined()
        expect(httpService).toBeDefined()
        expect(service).toBeDefined()
    })

    describe('fetchData', () => {
        it('should fetch data from both API providers and insert data', async () => {
            const dummyJobs = [
                {
                    title: 'Test Job',
                    companyName: 'Test Company',
                    website: 'http://testcompany.com',
                    industry: 'Tech',
                    currency: 'USD',
                    experience: 2,
                    location: 'Remote',
                    postedDate: new Date(),
                    remote: true,
                    salaryMin: 50000,
                    salaryMax: 70000,
                    skills: ['JavaScript', 'NestJS'],
                },
            ]

            const fetchDataOneSpy = jest
                .spyOn<any, any>(service, 'fetchDataOne')
                .mockResolvedValue(dummyJobs)
            const fetchDataTwoSpy = jest
                .spyOn<any, any>(service, 'fetchDataTwo')
                .mockResolvedValue(dummyJobs)

            const insertDataSpy = jest
                .spyOn<any, any>(service, 'insertData')
                .mockResolvedValue(undefined)

            await service.fetchData()

            expect(fetchDataOneSpy).toHaveBeenCalled()
            expect(fetchDataTwoSpy).toHaveBeenCalled()
            expect(insertDataSpy).toHaveBeenCalledWith([
                ...dummyJobs,
                ...dummyJobs,
            ])
        })
    })

    describe('findAllQb', () => {
        it('should build a query and return paginated data', async () => {
            const query: QueryBuilderParams<Job> = {
                page: 0,
                take: 10,
                filter: { title: 'Developer' },
            }

            const res = await service.findAllQb(query)

            expect(res).toEqual({
                pagination: {
                    take: 10,
                    count: 0,
                    currentPage: 0,
                    hasNextPage: false,
                    hasPrevPage: false,
                    lastPage: 0,
                    nextPage: 1,
                    prevPage: -1,
                },
                result: [],
            })

            expect(jobRepository.createQueryBuilder).toHaveBeenCalledWith('job')
        })
    })
})
