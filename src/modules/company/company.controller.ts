import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { QueryParams, SingleQueryParams } from '../base'
import { CompanyService } from './company.service'
import { Company } from './entities/company.entity'

@Controller('company')
@ApiTags('Company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get()
    findAll(@Query() query: QueryParams<Company>) {
        return this.companyService.findAll(query)
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Query() query: SingleQueryParams<Company>,
    ) {
        return this.companyService.findOne(+id, query)
    }
}
