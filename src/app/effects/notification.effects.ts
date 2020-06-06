import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, timer } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import * as appActions from '../actions/app.actions';
import * as jenkinsActions from '../actions/jenkins.actions';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class NotificationEffects {

  requestNotificationPermission$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.requestNotificationPermission),
    mergeMap(() => this.notificationService.requestNotificationPermission()
      .pipe(
        map(notificationPermission => appActions.notifyPermission({ notificationPermission }))
        )
    )));


  constructor(
    private actions$: Actions,
    private notificationService: NotificationService
  ) { }
}
