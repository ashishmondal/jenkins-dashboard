import { createAction, props } from '@ngrx/store';

import { Config } from '../models/config.model';

export const loadConfig = createAction('[App] Load Config');
export const loadConfigFile = createAction('[App] Load Config File', props<{ file: File }>());
export const saveConfig = createAction('[App] Save Config', props<{ config: Config }>());
export const configLoadSuccess = createAction('[App] Config Loaded', props<{ config: Config }>());
export const configLoadFailed = createAction('[App] Config Load Failed');
