import { BaseEntity } from 'src/modules/base'
import { Column } from 'typeorm'

export class User extends BaseEntity {
    @Column({ type: 'varchar', unique: true })
    username: string
}
