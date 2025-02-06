import { BaseJob } from 'src/modules/utils/types/data-transformed.type'
import {
	ApiTwoJobType,
	ApiTwoResponse,
} from 'src/modules/utils/types/ProviderTwoRes.type'

export default class ApiTwoMapper {
    static mapJob(job: ApiTwoJobType): BaseJob {
        return {
            title: job.position,
            location: `${job.location.city}, ${job.location.state}`,
            remote: job.location.remote,
            employmentType: 'Unknown',
            salaryMin: job.compensation.min,
            salaryMax: job.compensation.max,
            currency: job.compensation.currency,
            companyName: job.employer.companyName,
            industry: 'Unknown',
            website: job.employer.website,
            experience: job.requirements.experience,
            skills: job.requirements.technologies,
            postedDate: job.datePosted,
        }
    }

    static mapResponse(response: ApiTwoResponse): BaseJob[] {
        return Object.values(response.data.jobsList).map(ApiTwoMapper.mapJob)
    }
}
