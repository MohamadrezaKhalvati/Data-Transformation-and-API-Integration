import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../base'
import { Skill } from './entities/skill.entity'

@Injectable()
export class SkillService extends BaseService<Skill> {
    constructor(
        @InjectRepository(Skill)
        private readonly skillRepository: Repository<Skill>,
    ) {
        super(skillRepository)
    }
}
