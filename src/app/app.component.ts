import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as appActions from './actions/app.actions';
import { selectConfig, selectPipeline, State, selectJob } from './reducers';
import { map } from 'rxjs/operators';

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

  ngOnInit(): void {
    this.store.dispatch(appActions.loadConfig());
  }

  getProject(url: string) {
    return this.store.pipe(select(selectPipeline, { url }));
  }

  getJob(pipeline: string, job: string) {
    const url = `${pipeline}job/${job}/`;
    return this.store.pipe(select(selectJob, { url }));
  }

  uploadConfig(file: File) {
    this.store.dispatch(appActions.loadConfigFile({ file }));
  }
}
