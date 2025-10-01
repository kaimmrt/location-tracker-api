import { Column, Entity } from 'typeorm';
import { BaseTrackedEntity } from './base.entity';
import { EntryEventEnum } from 'src/shared/entry-event.enum';

@Entity({ name: 'entry_logs' })
export class EntryLog extends BaseTrackedEntity {
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  areaId!: string;

  @Column({ type: 'enum', enum: EntryEventEnum, enumName: 'entry_event' })
  event!: EntryEventEnum;
}
