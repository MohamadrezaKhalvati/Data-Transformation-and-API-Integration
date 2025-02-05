export type ApiOneJobType = {
    jobId: string
    title: string
    details: {
        location: string
        type: string
        salaryRange: string
    }
    company: {
        name: string
        industry: string
    }
    skills: string[]
    postedDate: string
}

type Metadata = {
    requestId: string
    timestamp: string
}

export type ApiOneResponse = {
    metadata: Metadata
    jobs: ApiOneJobType[]
}
