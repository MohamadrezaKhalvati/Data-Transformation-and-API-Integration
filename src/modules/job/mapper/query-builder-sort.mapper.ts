import { BaseEntity } from 'src/modules/base'
import { FindOptionsOrder } from 'typeorm'

export class QueryBuilderSortMapper<T extends BaseEntity> {
    private params?: FindOptionsOrder<T>

    constructor(sort: FindOptionsOrder<T>) {
        this.params = sort
    }

    public fromFindOptionsOrderToQueryBuilder(): any {
        let a: {
            field: string
            type: 'ASC' | 'DESC'
        }
        if (!this.params) {
            a = {
                field: 'job.id',
                type: 'DESC',
            }
        } else {
            for (const element in this.params) {
                a = {
                    ...a,
                    field: 'job.' + element,
                    type: this.params[element] as 'ASC' | 'DESC',
                }
            }
        }
        return a
    }
}
