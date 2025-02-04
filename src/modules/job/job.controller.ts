import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { JobService } from './job.service'

@Controller('job')
@ApiTags('Job')
export class JobController {
    constructor(private readonly jobService: JobService) {}
}
