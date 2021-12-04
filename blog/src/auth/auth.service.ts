import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UserLoginDto, UserRegisterDto } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  private mockUser = {
    email: 'jake@jake.jake',
    token: 'jwt.token.here',
    username: 'jake',
    bio: 'I work at statefarm',
    image: null,
  };

  async register(userDto: UserRegisterDto) {
    try {
      const user = this.userRepo.create(userDto);
      await this.userRepo.save(user);
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);
      return { user: { ...user.toJSON(), token } };
    } catch (error) {
      if ((error.code = '23505')) {
        throw new ConflictException('Username has already been taken');
      }
      throw new BadRequestException();
    }
  }

  async login(userDto: UserLoginDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { email: userDto.email },
      });
      if (user && (await user.comparePassword(userDto.password))) {
        const payload = { username: user.username };
        const token = this.jwtService.sign(payload);
        return { user: { ...user.toJSON(), token } };
      }
    } catch (error) {
      throw new BadRequestException();
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
