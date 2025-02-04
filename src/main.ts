import {
	BadRequestException,
	INestApplication,
	ValidationPipe,
} from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'fs'
import { ServerResponse } from 'http'
import * as path from 'path'
import { AppModule } from './app.module'
import { ExceptionsFilter } from './modules/base'
import { RemovePasswordInterceptor } from './modules/base/middlewares/convert-response.interceptor'
import { QueryExecutionTimeInterceptor } from './modules/base/middlewares/query-execution-time.interceptor'
import { TransformInterceptor } from './modules/base/middlewares/transform.interceptor'
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
        .setTitle('VamJoo api')
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

    app.use('/api-doc', (_, res: ServerResponse) =>
        res.end(JSON.stringify(document)),
    )
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    setupSwagger(app)
    enableGlobalValidations(app)
    await app.listen(process.env.APP_PORT)
}

bootstrap()
