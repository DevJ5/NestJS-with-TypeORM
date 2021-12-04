import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseInterceptors,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { AuthGuard } from '../guards/auth.guard';
import {
  Serialize,
  SerializeInterceptor,
} from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    console.log(session);
    session.color = color;
  }

  @Get('/colors')
  getcolor(@Session() session: any) {
    console.log(session);
    return session.color;
  }
  // TODO:
  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   console.log(session.userId);
  //   return this.usersService.findOne(parseInt(session.userId));
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  // @UseInterceptors(CurrentUserInterceptor) -> This is moved to the APP_INTERCEPTOR so all modules use it
  whoAmI(@Request() request: Request, @CurrentUser() user: User) {
    // CurrentUser is a custom decorator to make it more explicit, Request can also be used:
    return user;
    return request['currentUser'];
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  // Nest docs approach: @UseInterceptors(ClassSerializerInterceptor)
  // Dynamic approach: @UseInterceptors(new SerializeInterceptor(UserDto))
  // Custom decorator to shorten syntax: @Serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
