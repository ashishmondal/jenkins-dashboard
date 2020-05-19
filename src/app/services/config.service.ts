import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../models/config.model';
import { shareReplay } from 'rxjs/operators';
import { of, throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) {
  }

  public getConfig() {
    const config = localStorage.getItem('config');

    return config ? of(JSON.parse(config) as Config) : throwError('No Config Stored!');
  }

  public saveConfig(config: Config) {
    localStorage.setItem('config', JSON.stringify(config, null, '  '));
    return of(config);
  }

  public loadConfigFile(file: File) {
    return new Observable<Config>(subscriber => {
      const reader = new FileReader();
      reader.addEventListener('load', event => {
        try {
          // tslint:disable-next-line: no-non-null-assertion
          subscriber.next(JSON.parse(event.target!.result as string));
          subscriber.complete();
        } catch (e) {
          subscriber.error(e);
        }
      });

      reader.readAsText(file);
    });
  }
}
