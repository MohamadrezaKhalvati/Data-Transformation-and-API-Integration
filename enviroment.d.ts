export interface Env {
    APP_PORT: string
    NODE_ENV: 'DEVELOPMENT' | 'PRODUCTION'
    POSTGRES_USER: string
    POSTGRES_PASSWORD: string
    POSTGRES_PORT: string
    POSTGRES_HOST: string
    POSTGRES_DB: string
    JWT_SECRET: string
    ADMIN_USERNAME: string
    ADMIN_PASSWORD: string
    JWT_EXPIRE_TIME: string
    SECRET_KEY: string
    IV: string
    FRONTEND_URL: string
    API_URL: string
    SMS_USERNAME: string
    SMS_PASSWORD: string
    SMS_NUMBER: string

    ZARINPAL_MERCHANT_ID: string
    ZIBAL_TOKEN: string
    CALL_BACK_URL: string
    KAVENEGAR_API_KEY: string
    MELI_PAYAMK_API: string
    SEND_SMS: 'YES' | 'NO'
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env {}
    }
}

export {}
