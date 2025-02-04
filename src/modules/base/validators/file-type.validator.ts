import { FileTypeValidator as DefaultFileTypeValidator } from '@nestjs/common'
export class FileTypeValidator extends DefaultFileTypeValidator {
    isValid(files?: any): boolean {
        const validations: boolean[] = []
        for (const file in files) {
            for (const image of files[file]) {
                validations.push(super.isValid(image))
            }
        }
        return validations.every(item => item)
    }
}
