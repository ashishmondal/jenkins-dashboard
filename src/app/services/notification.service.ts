import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { from } from 'rxjs';

import * as fromApp from '../actions/app.actions';
import { Build } from '../models/jenkins.model';
import { State } from '../reducers';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private store: Store<State>) {
    // if (window.Notification && Notification.permission !== 'granted') {
    //   Notification.requestPermission();
    // }
    const notificationPermission = window.Notification && Notification.permission;
    this.store.dispatch(fromApp.notifyPermission({ notificationPermission }));
  }

  requestNotificationPermission() {
    return from(Notification.requestPermission());
  }

  notifyBuild(title: string, build: Build) {
    const notification = new Notification(title,
      {
        body: build.fullDisplayName,
        badge: `/assets/images/badge.png`,
        icon: `/assets/images/${build.result}.png`
      });
    notification.onclick = () => window.focus();
  }
}
