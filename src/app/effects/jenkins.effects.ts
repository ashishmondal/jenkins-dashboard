import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import * as jenkinsActions from '../actions/jenkins.actions';
import { selectJobs, State } from '../reducers';
import { JenkinsService } from '../services/jenkins.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class JenkinsEffects {

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

      const state = existingBuild.building === build.building ? 'STILL RUNNING' : build.building ? 'STARTED' : 'FINISHED';
      const title = `BUILD ${build.displayName} ${build.result || ''} - ${state}`;
      this.notificationService.notifyBuild(title, build);
    }),
    switchMap(([{ build }]) => [jenkinsActions.buildLoadSuccessPost({ build })])
  ));

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private jenkinsService: JenkinsService,
    private notificationService: NotificationService
  ) { }
}
