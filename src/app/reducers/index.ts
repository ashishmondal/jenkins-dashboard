import { Dictionary } from '@ngrx/entity';
import { ActionReducerMap, createSelector, MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment';

import { Job, Pipeline } from '../models/jenkins.model';
import * as fromConfig from './config.reducer';
import * as fromJob from './job.reducer';
import * as fromPipeline from './pipeline.reducer';
import { jobLoadSuccess } from '../actions/jenkins.actions';
import * as fromApp from './app.reducer';

export interface State {
  app: fromApp.State;
  config: fromConfig.State;
  pipelines: fromPipeline.State;
  jobs: fromJob.State;
}

export const reducers: ActionReducerMap<State> = {
  app: fromApp.reducer,
  config: fromConfig.reducer,
  pipelines: fromPipeline.reducer,
  jobs: fromJob.reducer
};

const selectAppState = (state: State) => state.app;
export const selectNotificationPermission = createSelector(selectAppState, state => state.notificationPermission);

const selectConfigState = (state: State) => state.config;
export const selectConfig = createSelector(selectConfigState, state => state.config);
export const selectConfigLoading = createSelector(selectConfigState, state => state.isLoading);

const selectPipelinesState = (state: State) => state.pipelines;
export const selectPipelines = createSelector(selectPipelinesState, fromPipeline.selectAllPipelines);
export const selectPipelineLoading = createSelector(selectPipelines, pipelines => pipelines.some(p => p.isLoading));
export const selectPipelineEntities = createSelector(selectPipelinesState, fromPipeline.selectPipelineEntities);
export const selectPipeline = createSelector(
  selectPipelineEntities,
  (entities: Dictionary<Pipeline>, props: { url: string }) => entities[props.url]
);

const selectJobsState = (state: State) => state.jobs;
export const selectJobs = createSelector(selectJobsState, fromJob.selectAllJobs);
export const selectJobsLoading = createSelector(selectJobs, jobs => jobs.some(j => j.isLoading));
export const selectJobEntities = createSelector(selectJobsState, fromJob.selectJobEntities);
export const selectJob = createSelector(
  selectJobEntities,
  (entities: Dictionary<Job>, props: { url: string }) => entities[props.url]
);

export const selectLoading = createSelector(
  selectConfigLoading,
  selectPipelineLoading,
  selectJobsLoading,
  (c, p, j) => c || p || j
);

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
