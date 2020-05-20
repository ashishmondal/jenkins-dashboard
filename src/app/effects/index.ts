import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { config, of, timer } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import * as appActions from '../actions/app.actions';
import * as jenkinsActions from '../actions/jenkins.actions';
import { selectJobs, State } from '../reducers';
import { ConfigService } from '../services/config.service';
import { JenkinsService } from '../services/jenkins.service';
import { NotificationService } from '../services/notification.service';

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
    tap(({ config }) => this.titleService.setTitle(config.appName)),
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
        catchError(loadError => of(jenkinsActions.pipelineLoadFailed({ url, loadError }))
        ))
    )));

  loadProjectSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(jenkinsActions.pipelineLoadSuccess),
    withLatestFrom(this.store),
    switchMap(([{ pipeline }, state]) =>
      state.config.config.jenkins.jobs.map(job => jenkinsActions
        .loadJob({ url: `${pipeline.url}job/${job}/` })))
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
        map(build => jenkinsActions.buildLoadSuccessPre({ build })),
        catchError(() => of(jenkinsActions.buildLoadFailed({ url }))
        ))
    )));

  buildLoadSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(jenkinsActions.buildLoadSuccessPre),
    withLatestFrom(this.store.pipe(select(selectJobs))),
    tap(([{ build }, job]) => {
      const existingBuild = job.find(j => build.url.startsWith(j.url))?.build;
      if (!existingBuild || (existingBuild.result === build.result && existingBuild.building === build.building)) {
        return;
      }

      const state = existingBuild.building === build.building? 'STILL RUNNING': build.building? 'STARTED' : 'FINISHED';
      const title = `BUILD ${build.displayName} ${build.result || ''} - ${state}`;
      this.notificationService.notifyBuild(title, build);
    }),
    switchMap(([{ build }]) => [jenkinsActions.buildLoadSuccessPost({ build })])
  ));

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private configService: ConfigService,
    private jenkinsService: JenkinsService,
    private titleService: Title,
    private notificationService: NotificationService
  ) { }
}
