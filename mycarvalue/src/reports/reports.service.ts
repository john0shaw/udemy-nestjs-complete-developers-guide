import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report) private repo: Repository<Report>
    ) { }

    create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto);
        
        report.user = user;

        return this.repo.save(report);
    }

    async changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne({where: { id: parseInt(id)}});

        if (!report) {
            throw new NotFoundException('report not found');
        }

        report.approved = approved;
        return this.repo.save(report);
    }

    createEstimate({make, model, lng, lat, year, mileage}: GetEstimateDto) {
        return this.repo.createQueryBuilder()
            .select('avg(price)', 'price')
            .where('make = :make', {make})
            .andWhere('model = :model', {model})
            .andWhere('lng - :lng between -5 and 5', {lng})
            .andWhere('lat - :lat between -5 and 5', {lat})
            .andWhere('year - :year between -3 and 3', {year})
            .orderBy('abs(mileage - :mileage)', 'DESC')
            .setParameters({mileage})
            .limit(3)
            .getRawOne();
    }
}
