import { UserRepository } from './../user/user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let repository: UserRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileService, UserRepository],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  describe('ProfileService', () => {
    describe('parseReview', () =>{
      it('it should return full set of review', async () => {
        const reviews = [{
          mode: 1,
          count: 3
        }]
        service.parseReview(reviews)
      })
    })
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
