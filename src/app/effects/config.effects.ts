import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, timer } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import * as appActions from '../actions/app.actions';
import * as jenkinsActions from '../actions/jenkins.actions';
import { ConfigService } from '../services/config.service';

@Injectable()
export class ConfigEffects {

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

  constructor(
    private actions$: Actions,
    private configService: ConfigService,
    private titleService: Title,
  ) { }
}
