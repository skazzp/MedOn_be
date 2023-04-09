import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Doctor } from '@entities/Doctor';

@Controller('doctors')
export class DoctorController {
    jwtService: any;

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    getMe() {
        return 'Its doctor'
        // const doctor = req.user;
        // return {
        //     id: doctor.id,
        //     name: doctor.lastName,
        //     email: doctor.email,
        // };
    }
}
