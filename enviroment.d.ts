export interface Env {
    APP_PORT: string
    NODE_ENV: 'DEVELOPMENT' | 'PRODUCTION'
    POSTGRES_USER: string
    POSTGRES_PASSWORD: string
    POSTGRES_PORT: string
    POSTGRES_HOST: string
    POSTGRES_DB: string
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env {}
    }
}
