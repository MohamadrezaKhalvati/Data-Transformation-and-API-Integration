import {
	BadRequestException,
	INestApplication,
	Logger,
	ValidationPipe,
} from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'fs'
import * as path from 'path'
import { AppModule } from './app.module'
import { ExceptionsFilter } from './modules/base'
import { RemovePasswordInterceptor } from './modules/base/middlewares/convert-response.interceptor'
import { QueryExecutionTimeInterceptor } from './modules/base/middlewares/query-execution-time.interceptor'
import { TransformInterceptor } from './modules/base/middlewares/transform.interceptor'
import { CustomLogger } from './modules/base/utils/custom-logger'
import { UtilsService } from './modules/utils/utils.service'
async function enableGlobalValidations(app: INestApplication) {
    app.useGlobalInterceptors(new TransformInterceptor())

    app.useGlobalInterceptors(new RemovePasswordInterceptor())
    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        app.useGlobalInterceptors(new QueryExecutionTimeInterceptor())
    }
    app.useGlobalFilters(new ExceptionsFilter())
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            exceptionFactory: errors => {
                const result = new UtilsService().formatErrorData(errors)
                return new BadRequestException(result)
            },
        }),
    )
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept',
    })
}

async function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Transformation And Integration api')
        .setDescription('')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
        .setExternalDoc('Postman Collection', path.join(__dirname, 'docs-json'))
        .build()

    const metadata_ts = './metadata'
    if (fs.existsSync(path.join(__dirname, 'metadata.js'))) {
        const metadata = await import(metadata_ts)
        await SwaggerModule.loadPluginMetadata(metadata.default)
    }

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    })
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new CustomLogger(),
    })
    setupSwagger(app)
    enableGlobalValidations(app)

    Logger.log(
        `Connecting to the database at ${process.env.POSTGRES_HOST} with name ${process.env.POSTGRES_DB}`,
        'Database',
    )

    await app.listen(process.env.APP_PORT)
    Logger.log('Server started ' + process.env.APP_PORT, 'BOOTSTRAP')
}

bootstrap()
