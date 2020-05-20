import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Build, Job, Pipeline } from '../models/jenkins.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {
    if (window.Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
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
