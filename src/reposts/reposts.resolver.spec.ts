import { Test, TestingModule } from '@nestjs/testing';
import { RepostsResolver } from './reposts.resolver';
import { RepostsService } from './reposts.service';

describe('RepostsResolver', () => {
  let resolver: RepostsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepostsResolver, RepostsService],
    }).compile();

    resolver = module.get<RepostsResolver>(RepostsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
