import { ValidationError } from 'quidquid-picker';
import { TracksPipe } from './tracks.pipe';
import { Track } from './track.entity';

const tracksPipe = new TracksPipe();

describe('TracksPipe', () => {
  it('should be defined', () => {
    expect(new TracksPipe()).toBeDefined();
  });

  describe('transform', () => {
    test('should throw a ValidationError if the data is not acceptable', async () => {
      const data = {};
      expect(async () => {
        await tracksPipe.transform(data);
      }).rejects.toThrow(ValidationError);
    });
    test('should return a instance of Track if the data is acceptable', async () => {
      const data = { name: 'TVL' };
      const track = await tracksPipe.transform(data);
      expect(track).toBeInstanceOf(Track);
      expect(track.getName()).toBe(data.name);
    });
  });
});
