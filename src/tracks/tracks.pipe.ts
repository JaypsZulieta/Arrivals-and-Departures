import { Injectable, PipeTransform } from '@nestjs/common';
import { Track, TrackBuilder } from './track.entity';
import { Quidquid } from 'quidquid-picker';

@Injectable()
export class TracksPipe implements PipeTransform<any, Promise<Track>> {
  public async transform(value: any): Promise<Track> {
    const data = Quidquid.from(value);
    const name = await data.pickString('name');
    return new TrackBuilder().name(name).build();
  }
}
