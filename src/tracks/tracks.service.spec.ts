import { ConflictException, NotFoundException } from '@nestjs/common';
import { TrackBuilder } from './track.entity';
import { TrackRepository } from './track.repository';
import { StandardTrackService } from './tracks.service';
import { Quidquid } from 'quidquid-picker';

const trackRepository = {
  save: jest.fn(),
  existById: jest.fn(),
  existByName: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  findAll: jest.fn(),
  delete: jest.fn(),
} satisfies jest.Mocked<TrackRepository>;
const trackService = new StandardTrackService(trackRepository);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('StandardTrackService', () => {
  describe('create', () => {
    test('should throw a ConflictException if the track id already exists', async () => {
      trackRepository.existById.mockResolvedValue(true);
      const track = new TrackBuilder().build();

      const action = async () => {
        await trackService.create(track);
      };

      expect(action).rejects.toThrow(ConflictException);
    });

    test('should throw a ConflicException if the track name already exists', async () => {
      trackRepository.existById.mockResolvedValue(false);
      trackRepository.existByName.mockResolvedValue(true);
      const track = new TrackBuilder().build();

      const action = async () => {
        await trackService.create(track);
      };

      expect(action).rejects.toThrow(ConflictException);
    });

    test("should call the TrackRepository.save method if the id and name aren't already taken", async () => {
      trackRepository.existById.mockResolvedValue(false);
      trackRepository.existByName.mockResolvedValue(false);
      const track = new TrackBuilder().build();

      await trackService.create(track);
      expect(trackRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    test('should throw a NotFoundException if the id does not exist', () => {
      trackRepository.existById.mockResolvedValue(false);

      const action = async () => {
        await trackService.findById('123');
      };
      expect(action).rejects.toThrow(NotFoundException);
    });

    test('should call TrackRepository.findById if the id does exist', async () => {
      trackRepository.existById.mockResolvedValue(true);
      await trackService.findById('id');
      expect(trackRepository.existById).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByName', () => {
    test('should throw a NotFoundException if the name does not exist', () => {
      trackRepository.existByName.mockResolvedValue(false);

      const action = async () => {
        await trackService.findByName('Epyc');
      };
      expect(action).rejects.toThrow(NotFoundException);
    });

    test('should call TrackRepository.findByName method if the name does exist', async () => {
      trackRepository.existByName.mockResolvedValue(true);

      await trackService.findByName('Epyc');
      expect(trackRepository.findByName).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    test('should throw a NotFoundException if the track id does not exist', () => {
      trackRepository.existById.mockResolvedValue(false);
      const action = async () => {
        await trackService.update(Quidquid.from('adada'), '123');
      };
      expect(action).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteById', () => {
    test('should throw a NotFoundException if the track id does not exist', () => {
      trackRepository.existById.mockResolvedValue(false);

      const action = async () => {
        await trackService.deleteById('id');
      };

      expect(action).rejects.toThrow(NotFoundException);
    });

    test('should call the the TrackRepository.delete method if the id does exist', async () => {
      trackRepository.existById.mockResolvedValue(true);
      await trackService.deleteById('123');
      expect(trackRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
