import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Build, Job, Pipeline } from '../models/jenkins.model';

@Injectable({
  providedIn: 'root'
})
export class JenkinsService {

  constructor(private http: HttpClient) {

  }

  public getPipeline(url: string) {
    return this.http.get<Pipeline>(`${url}api/json/`);
  }

  public getJob(url: string) {
    return this.http.get<Job>(`${url}api/json/`);
  }

  public getBuild(url: string) {
    return this.http.get<Build>(`${url}api/json/`);
  }
}
