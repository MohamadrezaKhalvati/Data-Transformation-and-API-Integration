import { Injectable } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import * as crypto from 'crypto'

@Injectable()
export class UtilsService {
    private secretKey = process.env.SECRET_KEY
    private iv = process.env.IV
    private algorithm = 'aes-256-cbc'

    formatErrorData(data: ValidationError[]) {
        const formattedData = {}
        for (const item of data) {
            if (item?.children?.length) {
                formattedData[item.property] = item.children.map(data => {
                    return data.children.map(data => ({
                        [data.property]: Object.values(data.constraints)[0],
                    }))
                })
            } else {
                formattedData[item.property] = Object.values(
                    item.constraints,
                )[0]
            }
        }
        return formattedData
    }

    encryptPassword(password: string) {
        const iv_buffer: Buffer = Buffer.from(this.iv, 'hex')

        const cipher = crypto.createCipheriv(
            this.algorithm,
            this.secretKey,
            iv_buffer,
        )
        let encrypted = cipher.update(password, 'utf8', 'hex')
        encrypted += cipher.final('hex')
        return encrypted
    }

    decryptPassword(encryptedPassword: string) {
        const iv_buffer: Buffer = Buffer.from(process.env.IV, 'hex')
        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.secretKey,
            iv_buffer,
        )
        let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    }

    parseFloat(str: string, val: number): number {
        str = str.toString()
        if (!str.includes('.')) return Number(str)
        str = str.slice(0, str.indexOf('.') + val + 1)
        return Number(str)
    }

    formatBytes(bytes: number, decimals = 1, sentence?: string) {
        if (sentence && !(bytes || bytes > 0)) {
            const rr = /(\d+)\ (bytes)/
            const bb: RegExpMatchArray | null = sentence.match(rr)
            bytes = Number((bb as RegExpMatchArray)[1])
        }

        if (!Number(bytes)) return 0

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        // const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return this.parseFloat((bytes / Math.pow(k, i)).toString(), dm)

        // if (sentence) {
        //   const rr = /(\d+)\ (bytes)/;
        //   const bb: RegExpMatchArray | null = sentence.match(rr);
        //   return sentence
        //     .replace(
        //       bytes.toString(),
        //       `${this.parseFloat((bytes / Math.pow(k, i)).toString(), dm)} ${sizes[i]}`,
        //     )
        //     .replace(/(bytes)/, '');
        // }

        // return `${this.parseFloat((bytes / Math.pow(k, i)).toString(), dm)} ${sizes[i]}`
    }

    bytesToGB(bytes) {
        return bytes / (1024 * 1024 * 1024)
    }

    GBToBytes(GB) {
        return GB * (1024 * 1024 * 1024)
    }

    fixPersianNumber(str: string): string | number {
        if (!str) return str
        str = str.toString()

        const persianNumberArr = [
            /۰/g,
            /۱/g,
            /۲/g,
            /۳/g,
            /۴/g,
            /۵/g,
            /۶/g,
            /۷/g,
            /۸/g,
            /۹/g,
        ]
        const arabicNumberArr = [
            /٠/g,
            /١/g,
            /٢/g,
            /٣/g,
            /٤/g,
            /٥/g,
            /٦/g,
            /٧/g,
            /٨/g,
            /٩/g,
        ]

        for (let i = 0; i < 10; i++) {
            str = str
                .replace(persianNumberArr[i], i.toString())
                .replace(arabicNumberArr[i], i.toString())
        }
        console.log('> str ', str)
        console.log('> Number.isNaN(Number(str)) ', Number.isNaN(Number(str)))
        console.log('> Number(str) ', Number(str))
        return Number.isNaN(Number(str)) ? str : Number(str)
    }

    convertToReadableSize(bytes: number, precision = 2) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB']

        bytes = Math.max(bytes, 0)
        let pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024))
        pow = Math.min(pow, units.length - 1)

        bytes /= Math.pow(1024, pow)

        return this.parseFloat(bytes.toString(), precision) + ' ' + units[pow]
    }

    convertSecondsToMilliseconds(seconds: number) {
        return seconds * 1000
    }

    convertMinutesToMilliseconds(minutes: number) {
        return minutes * 60 * 1000
    }
}
