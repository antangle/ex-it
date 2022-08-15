import { User } from './../../entities/user.entity';
import { UtilService } from './../util/util.service';
import { UtilModule } from './../util/util.module';
import { UserRepository } from './../user/user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';

type MockRepository<T=any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockRepository = () => {

}

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: MockRepository<UserRepository>;
  let utilService: UtilService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [/* 
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath:'.env.dev'
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: TypeOrmTestConfig,
          inject: [ConfigService]
        }),
        TypeOrmModule.forFeature([AuthRepository, UserRepository]), */
        UtilModule,
      ],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockRepository()
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(UserRepository));
    utilService = module.get<UtilService>(UtilService);
  });

  describe('AuthService', () => {
    describe('SignIn', async () => {
      const user: User = {id: 1}
      await authService.signIn(user, 'local')
      
    })
  })
});