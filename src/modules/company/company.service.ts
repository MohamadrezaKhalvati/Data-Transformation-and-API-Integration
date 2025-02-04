import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../base'
import { Company } from './entities/company.entity'

@Injectable()
export class CompanyService extends BaseService<Company> {
    constructor(
        @InjectRepository(Company)
        private readonly compnayRepository: Repository<Company>,
    ) {
        super(compnayRepository)
    }
}
