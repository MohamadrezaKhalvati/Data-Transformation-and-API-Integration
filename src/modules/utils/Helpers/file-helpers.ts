import { Injectable } from '@nestjs/common'
import fs from 'fs'
import path from 'path'
import process from 'process'
import { UtilsService } from '../utils.service'

@Injectable()
export class FileHelpers extends UtilsService {
    constructor() {
        super()
    }

    async checkAndCreateConfigFolder(path_name?: string) {
        const folderPath = path_name
            ? path.join(process.cwd(), 'public', 'config', path_name)
            : path.join(process.cwd(), 'public', 'config')
        try {
            await fs.promises.access(folderPath)
        } catch (error) {
            await fs.promises.mkdir(folderPath)
        }
    }

    async checkAndCreatePublicFolder(path_name?: string) {
        const folderPath = path_name
            ? path.join(process.cwd(), 'public', path_name)
            : path.join(process.cwd(), 'public')
        try {
            await fs.promises.access(folderPath)
        } catch (error) {
            await fs.promises.mkdir(folderPath)
        }
    }
}
