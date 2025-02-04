import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { FindOptionsOrder } from 'typeorm'
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations'
import { FindOptionsSelect } from 'typeorm/find-options/FindOptionsSelect'
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere'

export class SingleQueryParams<T = any> {
    @IsOptional()
    @Type(() => Object)
    relation?: FindOptionsRelations<T>

    @IsOptional()
    @Type(() => Object)
    select?: FindOptionsSelect<T>

    @IsOptional()
    @Type(() => Object || Array)
    filter?: FindOptionsWhere<T>[] | FindOptionsWhere<T>
}

export class QueryParams<T = any> extends SingleQueryParams<T> {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    take?: number = 200

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page?: number = 0

    @IsOptional()
    @Type(() => Object)
    sort?: FindOptionsOrder<T>
}

export class AdvertisingQueryParams<T = any> extends QueryParams<T> {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    min_price: number

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    max_price: number
}

export class PaymentQueryParams {
    @Type(() => String)
    @IsString()
    Authority: string

    @Type(() => String)
    @IsString()
    Status: 'NOK' | 'OK'
}

export class QueryBuilderParams<T = any> {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    take?: number = 20

    @IsOptional()
    @Type(() => Object || Array)
    filter?: FindOptionsWhere<T>[] | FindOptionsWhere<T>

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page?: number = 0

    @IsOptional()
    @Type(() => Object)
    sort?: { field: FindOptionsOrder<T>; type: 'ASC' | 'DESC' }

    @IsOptional()
    @Type(() => Object)
    relation?: FindOptionsRelations<T>

    @IsOptional()
    @Type(() => Object)
    select?: FindOptionsSelect<T>
}
