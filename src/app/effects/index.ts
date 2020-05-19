import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { config, of, timer } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import * as appActions from '../actions/app.actions';
import * as jenkinsActions from '../actions/jenkins.actions';
import { State } from '../reducers';
import { ConfigService } from '../services/config.service';
import { JenkinsService } from '../services/jenkins.service';

@Injectable()
export class AppEffects {

  loadConfig$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.loadConfig),
    mergeMap(() => this.configService.getConfig()
      .pipe(
        map(config => appActions.configLoadSuccess({ config })),
        catchError(() => of(appActions.configLoadFailed())
        ))
    )));

  configLoadSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.configLoadSuccess),
    switchMap(({ config }) => timer(0, config.delay * 1000).pipe(
      switchMap(() => config.jenkins.pipelines.map(url => jenkinsActions.loadPipeline({ url })))
    ))));

  loadConfigFile$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.loadConfigFile),
    mergeMap(({ file }) => this.configService.loadConfigFile(file)
      .pipe(
        map(config => appActions.saveConfig({ config })),
        catchError(() => of(appActions.configLoadFailed())
        ))
    )));

  saveConfig$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.saveConfig),
    mergeMap(({ config }) => this.configService.saveConfig(config)
      .pipe(
        map(_ => appActions.loadConfig()),
        catchError(() => of(appActions.configLoadFailed())
        ))
    )));

  loadProject$ = createEffect(() => this.actions$.pipe(
    ofType(jenkinsActions.loadPipeline),
    mergeMap(({ url }) => this.jenkinsService.getPipeline(url)
      .pipe(
        map(pipeline => jenkinsActions.pipelineLoadSuccess({ pipeline })),
        catchError(() => of(jenkinsActions.pipelineLoadFailed({ url }))
        ))
    )));

  loadProjectSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(jenkinsActions.pipelineLoadSuccess),
    withLatestFrom(this.store),
    switchMap(([{ pipeline }, state]) =>
      state.config.config.jenkins.jobs.map(job => jenkinsActions
        .loadJob({ url: `${pipeline.url}/job/${encodeURI(job)}/` })))
  ));

  loadJob$ = createEffect(() => this.actions$.pipe(
    ofType(jenkinsActions.loadJob),
    mergeMap(({ url }) => this.jenkinsService.getJob(url)
      .pipe(
        map(job => jenkinsActions.jobLoadSuccess({ job })),
        catchError(() => of(jenkinsActions.jobLoadFailed({ url }))
        ))
    )));

  loadJobSuccess = createEffect(() => this.actions$.pipe(
    ofType(jenkinsActions.jobLoadSuccess),
    // tslint:disable-next-line: no-non-null-assertion
    switchMap(({ job }) => [jenkinsActions.loadBuild({ url: job.lastBuild!.url })])
  ));

  loadBuild$ = createEffect(() => this.actions$.pipe(
    ofType(jenkinsActions.loadBuild),
    mergeMap(({ url }) => this.jenkinsService.getBuild(url)
      .pipe(
        map(build => jenkinsActions.buildLoadSuccess({ build })),
        catchError(() => of(jenkinsActions.buildLoadFailed({ url }))
        ))
    )));

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private configService: ConfigService,
    private jenkinsService: JenkinsService
  ) { }
}
