export type BaseJob = {
    title: string
    location: string
    remote: boolean
    employmentType: string
    salaryMin?: number
    salaryMax?: number
    currency: string
    companyName: string
    industry?: string
    website?: string
    experience?: number
    skills: string[]
    postedDate: string
}
