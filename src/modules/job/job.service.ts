import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../base'
import { Job } from './entities/job.entity'

@Injectable()
export class JobService extends BaseService<Job> {
    constructor(
        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
    ) {
        super(jobRepository)
    }
}
