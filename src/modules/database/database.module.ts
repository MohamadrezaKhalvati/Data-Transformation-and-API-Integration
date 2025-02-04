import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { databaseConfig, TypeOrmModels } from 'src/config'

@Module({
    imports: [
        TypeOrmModule.forRoot(databaseConfig),
        TypeOrmModule.forFeature(TypeOrmModels),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
