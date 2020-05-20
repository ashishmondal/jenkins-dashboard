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

    let duration: Duration;

    if (this.job.build.building) {

      duration = intervalToDuration({ start: new Date(this.job?.build.timestamp), end: new Date() });
    } else {
      const secs = (this.job?.build?.duration || 0) / 1000;
      // tslint:disable: no-bitwise
      duration = {
        hours: (secs / 3600) | 0,
        minutes: ((secs % 3600) / 60) | 0,
        seconds: (secs % 60) | 0
      };
    }

    return (duration.hours ? `${duration.hours}h ` : '')
      + (duration.minutes ? `${duration.minutes}m ` : '')
      + (duration.seconds ? `${duration.seconds}s` : '');
  }

  /**
   * get how fresh the build is - from 1 - 0, where when is fresh
   */
  get fresh() {
    if (!this.job.build) {
      return 0;
    }

    // get the timestamp in days
    const when = ((new Date()).getTime() - (new Date(this.job?.build.timestamp)).getTime()) / (1000 * 3600 * 12);

    if (when < 2) {
      return 1;
    } else if (when < 7) {
      return 0.9;
    } else if (when < 14) {
      return 0.8;
    } else if (when < 30) {
      return 0.7;
    }

    return 0.6;
  }
}
