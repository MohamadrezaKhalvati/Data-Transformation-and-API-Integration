import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { UserService } from 'src/modules/user/user.service'
import { UtilsService } from '../utils.service'

@Injectable()
export class UsersHelpersService extends UtilsService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ) {
        super()
    }

    async MakeUsername() {
        const username = 'VL_' + Math.random().toString(36).substr(2)
        const exist = await this.userService.findOneBy({ username }, {}, true)
        if (exist) {
            return this.MakeUsername()
        }
        return username
    }
}
