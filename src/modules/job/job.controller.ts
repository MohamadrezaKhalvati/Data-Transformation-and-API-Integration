import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { QueryParams } from '../base'
import { Job } from './entities/job.entity'
import { JobService } from './job.service'

@Controller('job')
@ApiTags('Job')
export class JobController {
    constructor(private readonly jobService: JobService) {}

    @Get('job-offers')
    jobOffers(@Query() query: QueryParams<Job>) {
        return this.jobService.findAll(query)
    }
}
