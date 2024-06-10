import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor (private configService: ConfigService) {}

    createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
        const isTest = process.env.NODE_ENV === 'test';

        const dbConfig: Partial<TypeOrmModuleOptions> = {
            type: 'sqlite',
            synchronize: false,
            database: this.configService.get<string>('DB_NAME'),
            autoLoadEntities: true
        };

        if (isTest) {
            Object.assign(dbConfig, {
                migrationsRun: true,
                migrations: ['src/migrations/*.ts']
            });
        }

        return dbConfig;
    }
}