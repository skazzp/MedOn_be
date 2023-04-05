import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './typeorm/entities/Patient';
import { PatientsModule } from './modules/patients/patients.module';
import { EmailModule } from './modules/email/email.module';
import { SpecialitiesModule } from './modules/specialities/specialities.module';
import { Speciality } from './typeorm/entities/Speciality';
import { Doctor } from './typeorm/entities/Doctor';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Patient, Speciality, Doctor],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    PatientsModule,
    SpecialitiesModule,
    EmailModule,
    AuthModule,
  ],
})
export class AppModule {}
