import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Job } from 'src/app/models/jenkins.model';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import intervalToDuration from 'date-fns/intervalToDuration';

@Component({
  selector: 'mui-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobComponent implements OnInit {

  @Input() job: Job;

  constructor() {
  }

  ngOnInit(): void {
  }

  get progress() {
    if (!this.job.build) {
      return 0;
    }

    const duration = (new Date()).getTime() - (new Date(this.job?.build.timestamp)).getTime();
    // tslint:disable-next-line:no-bitwise
    return (Math.min(duration / (this.job.build.estimatedDuration || 1), 1) * 100) | 0;
  }

  get timestamp() {
    return this.job?.build ?
      formatDistanceToNow(new Date(this.job?.build.timestamp), { addSuffix: true }) : '';
  }

  get duration() {
    if (!this.job.build) {
      return '';
    }

    const duration = intervalToDuration({ start: new Date(this.job?.build.timestamp), end: new Date() });
    return (duration.hours ? `${duration.hours}h ` : '')
      + (duration.minutes ? `${duration.minutes}m` : '')
      + (duration.seconds ? `${duration.seconds}s` : '');
  }
}
