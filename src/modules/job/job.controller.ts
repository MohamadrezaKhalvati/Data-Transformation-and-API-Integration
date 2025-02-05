import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { QueryBuilderParams } from '../base'
import { Job } from './entities/job.entity'
import { JobService } from './job.service'

@Controller('job')
@ApiTags('Job')
export class JobController {
    constructor(private readonly jobService: JobService) {}

    @Get('job-offers')
    jobOffers(@Query() query: QueryBuilderParams<Job>) {
        return this.jobService.findAllQb(query)
    }
}
