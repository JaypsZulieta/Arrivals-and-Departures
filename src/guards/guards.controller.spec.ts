import { Test, TestingModule } from '@nestjs/testing';
import { GuardsController } from './guards.controller';
import { guardsServiceProvider } from './guards.module';
import { ArgonPasswordEncoder } from 'jaypee-password-encoder';
import { PasswordModule } from '../password/password.module';

describe('GuardsController', () => {
  let controller: GuardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuardsController],
      providers: [guardsServiceProvider, ArgonPasswordEncoder],
      imports: [PasswordModule],
    }).compile();

    controller = module.get<GuardsController>(GuardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
