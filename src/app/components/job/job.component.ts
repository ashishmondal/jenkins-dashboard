import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Job } from 'src/app/models/jenkins.model';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

@Component({
  selector: 'mui-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobComponent implements OnInit {

  @Input() job: Job;

  constructor() {
    console.log('job');
   }

  ngOnInit(): void {
  }

  get progress() {
    return Math.min(
      (this.job?.build?.duration || 0) / (this.job?.build?.estimatedDuration || 1),
      1
    ) * 100;
  }

  get timestamp() {
    return this.job?.build ?
      formatDistanceToNow(new Date(this.job?.build.timestamp), { addSuffix: true }) : '';
  }

  get duration() {
    const duration = (this.job?.build?.duration || 0) / 1000;
    // tslint:disable: no-bitwise
    const h = (duration / 3600) | 0;
    const m = (duration / 60) | 0;
    const s = (duration % 60) | 0;
    return (h > 0 ? `${h}h` : '') + (m > 0 ? `${m}m` : '') + `${s}s`;
  }
}
