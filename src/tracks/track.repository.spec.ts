import { PrismaService } from '../prisma/prisma.service';
import { PrismaTrackRepository } from './track.repository';
import { TrackBuilder } from './track.entity';

const prismaService = new PrismaService();
const trackRepository = new PrismaTrackRepository(prismaService);

const updateSpy = jest.spyOn(prismaService.track, 'update').mockResolvedValue({} as any);
const createSpy = jest.spyOn(prismaService.track, 'create').mockResolvedValue({} as any);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PrismaTrackRepsitory', () => {
  describe('save', () => {
    test('should call update on prisma if the id already exists', async () => {
      jest.spyOn(trackRepository, 'existById').mockResolvedValue(true);
      const track = new TrackBuilder().build();
      await trackRepository.save(track);
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).not.toHaveBeenCalled();
    });

    test('should call create on prisma if the id does not exist', async () => {
      jest.spyOn(trackRepository, 'existById').mockResolvedValue(false);
      const track = new TrackBuilder().build();
      await trackRepository.save(track);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).not.toHaveBeenCalled();
    });
  });
});
