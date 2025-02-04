import { NotFoundException } from '@nestjs/common'

import { Repository, SelectQueryBuilder } from 'typeorm'
import { PaginateData } from '../utils/paginate-data'
import {
    QueryBuilderParams,
    QueryParams,
    SingleQueryParams,
} from '../validators/query-param.validator'

export abstract class BaseService<T> {
    protected constructor(protected repository: Repository<T | any>) {}

    async create(body: Partial<T>): Promise<T> {
        body['createdAt'] = new Date()
        body['updatedAt'] = new Date()
        const data = await this.repository.create(body)
        return await this.repository.save(data)
    }

    async hardDelete(id: number) {
        const res = await this.findOne(id)
        await this.repository.delete(id)
        return res
    }

    async findAllNoPagination(query: QueryParams<T>): Promise<T[]> {
        return this.repository.find({
            where: query.filter,
            relations: query.relation,
            ...query,
        })
    }

    parseBooleanValues(obj: any): any {
        if (typeof obj === 'object') {
            if (Array.isArray(obj)) {
                return obj.map(this.parseBooleanValues)
            } else {
                const result: any = {}
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const value = obj[key]
                        if (
                            typeof value === 'string' &&
                            (value === 'true' || value === 'false')
                        ) {
                            result[key] = value === 'true'
                        } else {
                            result[key] = this.parseBooleanValues(value)
                        }
                    }
                }
                return result
            }
        } else {
            return obj
        }
    }

    async findAll(
        query: QueryParams<T>,
        withDeleted?: boolean,
    ): Promise<FindAll<T>> {
        const { page = 0, take = 20, filter, sort } = query
        query.relation = this.parseBooleanValues(query?.relation)
        query.select = this.parseBooleanValues(query.select)
        const count = await this.repository.count({ where: filter })

        const data = await this.repository.find({
            take,
            withDeleted,
            skip: page * take,
            where: filter,
            order: sort ?? { id: -1 },
            relations: query.relation,
            select: query.select,
        })
        return PaginateData(data, page, take, count)
    }

    async findOne(
        id: number,
        query?: SingleQueryParams<T>,
        ignoreValidation?: boolean,
    ): Promise<T> {
        if (query?.relation)
            query.relation = this.parseBooleanValues(query?.relation)
        const res = await this.repository.findOne({
            where: { id },
            relations: query?.relation,
            select: query?.select,
        })

        if (!res && !ignoreValidation) {
            throw new NotFoundException()
        }

        return res
    }

    async findOneBy(
        obj: Partial<T>,
        query?: SingleQueryParams<T>,
        ignoreValidation?: boolean,
    ): Promise<T> {
        if (query?.relation)
            query.relation = this.parseBooleanValues(query?.relation)

        const res = await this.repository.findOne({
            where: obj,
            relations: query?.relation,
            select: query?.select,
            order: {
                id: 'DESC',
            },
        })
        if (!res && !ignoreValidation) {
            throw new NotFoundException()
        }
        return res
    }

    async update(id: number, body: Partial<T>) {
        // const data = await this.findOne(id);
        body['updatedAt'] = new Date()
        await this.repository.update(id, body)
        return await this.findOne(id)
    }

    async softDelete(id: number) {
        const entity = await this.findOne(id)
        await this.repository.softDelete(id)
        return entity
    }

    async softRemove(entity: T | T[]) {
        return this.repository.softRemove(entity)
    }

    async findAllQueryBuilder<T>(
        query: QueryBuilderParams<T>,
        cb: SelectQueryBuilder<T>,
    ) {
        const { page, take, sort } = query

        const res = await cb
            .offset(page * take)
            .take(take)
            .orderBy(sort?.field.toString(), sort?.type)
            .getMany()

        const count = await cb.getCount()
        return PaginateData(res, page, take, count)
    }
}
