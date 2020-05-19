import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as appActions from './actions/app.actions';
import { selectConfig, selectJob, selectLoading, selectPipeline, State } from './reducers';

@Component({
  selector: 'mui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private store: Store<State>) {
  }

  config$ = this.store.pipe(select(selectConfig));
  pipelines$ = this.config$.pipe(map(config => config.jenkins.pipelines));
  jobs$ = this.config$.pipe(map(config => config.jenkins.jobs));
  loading$ = this.store.pipe(select(selectLoading));

  ngOnInit(): void {
    this.store.dispatch(appActions.loadConfig());
  }

  getProject(url: string) {
    return this.store.pipe(select(selectPipeline, { url }));
  }

  getJobName(job: string) {
    // Jenkins job names are encoded twice to get url
    return decodeURIComponent(decodeURIComponent(job));
  }

  getJob(pipeline: string, job: string) {
    const url = `${pipeline}job/${job}/`;
    return this.store.pipe(select(selectJob, { url }));
  }

  uploadConfig(file: File) {
    this.store.dispatch(appActions.loadConfigFile({ file }));
  }
}
