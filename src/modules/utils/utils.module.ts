import { HttpModule } from '@nestjs/axios'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ThrottlerModule } from '@nestjs/throttler'
import * as path from 'path'
import { DatabaseModule } from '../database/database.module'
import { FileHelpers } from './Helpers/file-helpers'
import { UsersHelpersService } from './Helpers/users-helpers.service'
import { UtilsService } from './utils.service'
@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        HttpModule.register({ timeout: 60000 }),
        ThrottlerModule.forRoot([{ ttl: 60, limit: 150 }]),
        CacheModule.register(),
        // forwardRef(() => UserModule),
        MulterModule.register({
            dest: __dirname + '../upload',
        }),
        ScheduleModule.forRoot(),
        ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, '../..', 'public'),
            serveRoot: '/public',
        }),

        // MelipayamakModule.registerAsync({
        //     imports: [ConfigModule],
        //     inject: [ConfigService],
        //     useFactory: (configService: ConfigService) => ({
        //         phone_number: configService.get<string>('SMS_USERNAME'),
        //         password: configService.get<string>('SMS_PASSWORD'),
        //     }),
        // }),
    ],
    providers: [UtilsService, FileHelpers, UsersHelpersService],
    exports: [UtilsService, FileHelpers, UsersHelpersService],
})
export class UtilsModule {}
