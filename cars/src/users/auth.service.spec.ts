import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('asdf@asdf.com', 'asdf');
    expect(user.password).not.toBe('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error when a user signs up with existing email', async () => {
    expect.assertions(2);
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { id: 1, email: 'asdf@asdf.com', password: 'asdf' } as User,
    //   ]);

    await service.signUp('asdf@asdf.com', 'asdf');

    try {
      await service.signUp('asdf@asdf.com', 'asdf');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Email in use');
    }

    // await expect(
    //   service.signUp('user@mail.com', 'qwerty'),
    // ).rejects.toBeInstanceOf(BadRequestException);
    // await expect(
    //   service.signUp('user@mail.com', 'qwerty'),
    // ).rejects.toThrow('Email in use');
  });

  it('throws if sign in is called with an unused email', async () => {
    expect.assertions(3);

    try {
      const user = await service.signIn('asdf@asdf.com', 'asdf');
    } catch (error) {
      // error has a response object which is confusing
      expect(error.response.statusCode).toBe(404);
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('User not found');
    }
  });

  it('throws if an invalid password is provided', async () => {
    expect.assertions(1);

    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { id: 1, email: 'asdf@asdf.com', password: 'asdfffff' } as User,
    //   ]);

    await service.signUp('asdf@asdf.com', 'asdf');

    try {
      const user = await service.signIn('asdf@asdf.com', 'ASDF');
      console.log(user);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('returns a user if correct password is provided', async () => {
    await service.signUp('asdf@asdf.com', 'mypassword');
    const user = await service.signIn('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
