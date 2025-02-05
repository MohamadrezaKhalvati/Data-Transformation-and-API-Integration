import { Logger } from '@nestjs/common'
import { BaseJob } from '../types/data-transformed.type'
import { ApiOneJobType, ApiOneResponse } from '../types/ProviderOneRes.type'

// Added interface for salary parsing results
interface ParsedSalary {
    Min: number
    Max: number
    currency: string
}

export default class ApiOneMapper {
    private static parseSalaryRange(salaryRange: string): ParsedSalary | null {
        const currencyMap: { [key: string]: string } = {
            $: 'USD',
            '€': 'EUR',
            '£': 'GBP',
            '¥': 'JPY',
            '₹': 'INR',
            '₩': 'KRW',
            '₽': 'RUB',
            '₺': 'TRY',
            '₴': 'UAH',
        }

        try {
            const currencySymbol = salaryRange.match(/[^\d\skK-]/)?.[0] || '$'
            const cleaned = salaryRange
                .replace(
                    new RegExp(`[${Object.keys(currencyMap).join('')}]`, 'g'),
                    '',
                )
                .trim()

            const parts = cleaned.split(/\s*-\s+/)
            if (parts.length !== 2)
                throw new Error('Invalid salary range format')

            const parseSalary = (part: string): number => {
                const numericPart = part.replace(/k/gi, '').trim()
                const value = parseInt(numericPart, 10)
                if (isNaN(value)) throw new Error('Non-numeric salary value')
                return part.toLowerCase().includes('k') ? value * 1000 : value
            }

            return {
                Min: parseSalary(parts[0]),
                Max: parseSalary(parts[1]),
                currency: currencyMap[currencySymbol] || 'USD',
            }
        } catch (error) {
            console.error(
                `Salary parsing failed for "${salaryRange}": ${error}`,
            )
            return null
        }
    }

    static mapJob(job: ApiOneJobType): BaseJob {
        // Extract and parse salary information
        const salaryData = job.details.salaryRange
            ? ApiOneMapper.parseSalaryRange(job.details.salaryRange)
            : null

        return {
            title: job.title,
            location: job.details.location,
            remote: false,
            employmentType: job.details.type,
            salaryMin: salaryData?.Min,
            salaryMax: salaryData?.Max,
            currency: salaryData?.currency || 'USD',
            companyName: job.company.name,
            industry: job.company.industry,
            website: undefined,
            experience: undefined,
            skills: job.skills,
            postedDate: job.postedDate,
        }
    }

    static mapResponse(response: ApiOneResponse): BaseJob[] {
        return response.jobs
            .map(job => {
                try {
                    return ApiOneMapper.mapJob(job)
                } catch (error) {
                    Logger.error(`Error mapping job `)
                    return null
                }
            })
            .filter(Boolean) as BaseJob[]
    }
}
