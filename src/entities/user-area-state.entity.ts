import { Column, Entity, Unique } from 'typeorm';
import { BaseTrackedEntity } from './base.entity';

@Unique(['userId', 'areaId'])
@Entity({ name: 'user_area_states' })
export class UserAreaState extends BaseTrackedEntity {
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  areaId!: string;

  @Column({ type: 'boolean', default: false })
  isInside!: boolean;
}
