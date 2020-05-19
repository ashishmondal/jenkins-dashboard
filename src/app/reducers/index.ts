import { Action, createReducer, createSelector, on, ActionReducerMap, MetaReducer } from '@ngrx/store';

import * as appActions from '../actions/app.actions';
import * as jenkinsActions from '../actions/jenkins.actions';
import { Config } from '../models/config.model';
import { Pipeline, Job } from '../models/jenkins.model';
import * as fromPipeline from './pipeline.reducer';
import * as fromConfig from './config.reducer';
import { environment } from 'src/environments/environment';
import * as fromJob from './job.reducer';
import { Dictionary } from '@ngrx/entity';

export interface State {
  config: fromConfig.State;
  pipelines: fromPipeline.State;
  jobs: fromJob.State;
}

export const reducers: ActionReducerMap<State> = {
  config: fromConfig.reducer,
  pipelines: fromPipeline.reducer,
  jobs: fromJob.reducer
};

const selectConfigState = (state: State) => state.config;
export const selectConfig = createSelector(selectConfigState, state => state.config);

const selectPipelinesState = (state: State) => state.pipelines;
export const selectPipelines = createSelector(selectPipelinesState, fromPipeline.selectAllPipelines);
export const selectPipelineEntities = createSelector(selectPipelinesState, fromPipeline.selectPipelineEntities);
export const selectPipeline = createSelector(
  selectPipelineEntities,
  (entities: Dictionary<Pipeline>, props: {url: string}) => entities[props.url]
  );

const selectJobsState = (state: State) => state.jobs;
export const selectJobs = createSelector(selectJobsState, fromJob.selectAllJobs);
export const selectJobEntities = createSelector(selectJobsState, fromJob.selectJobEntities);
export const selectJob = createSelector(
  selectJobEntities,
  (entities: Dictionary<Job>, props: { url: string }) => entities[props.url]
);

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
