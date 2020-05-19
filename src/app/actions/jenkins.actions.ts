import { createAction, props } from '@ngrx/store';

import { Pipeline, Job, Build } from '../models/jenkins.model';

export const loadPipeline = createAction('[App] Load Pipeline', props<{ url: string}>());
export const pipelineLoadSuccess = createAction('[App] Pipeline Loaded', props<{ pipeline: Pipeline }>());
export const pipelineLoadFailed = createAction('[App] Pipeline Load Failed', props<{ url: string }>());

export const loadJob = createAction('[App] Load Job', props<{ url: string }>());
export const jobLoadSuccess = createAction('[App] Job Loaded', props<{ job: Job }>());
export const jobLoadFailed = createAction('[App] Job Load Failed', props<{ url: string }>());

export const loadBuild = createAction('[App] Load Build', props<{ url: string }>());
export const buildLoadSuccess = createAction('[App] Build Loaded', props<{ build: Build }>());
export const buildLoadFailed = createAction('[App] Build Load Failed', props<{ url: string }>());
