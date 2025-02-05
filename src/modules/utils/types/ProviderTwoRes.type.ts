export type ApiTwoJobType = {
    position: string
    location: {
        city: string
        state: string
        remote: boolean
    }
    compensation: {
        min: number
        max: number
        currency: string
    }
    employer: {
        companyName: string
        website: string
    }
    requirements: {
        experience: number
        technologies: string[]
    }
    datePosted: string
}

type JobsList = Record<string, ApiTwoJobType>

export type ApiTwoResponse = {
    status: string
    data: {
        jobsList: JobsList
    }
}
