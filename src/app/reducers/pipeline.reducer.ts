import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as fromApp from '../actions/app.actions';
import * as fromJenkins from '../actions/jenkins.actions';
import { Pipeline } from '../models/jenkins.model';

export interface State extends EntityState<Pipeline> {
  // additional entities state properties
  selectedPipeline: string | null;
}

export const adapter: EntityAdapter<Pipeline> = createEntityAdapter<Pipeline>({
  selectId: p => p.url,
});

export const initialState: State = adapter.getInitialState({
  selectedPipeline: null,
});

const pipelineReducer = createReducer(initialState,
  on(fromApp.configLoadSuccess, (state, { config }) =>
    adapter.addMany(config.jenkins.pipelines.map(url => ({
      url,
      isLoading: false
    })), state)
  ),
  on(fromJenkins.loadPipeline, (state, { url }) =>
    adapter.updateOne({
      id: url,
      changes: { isLoading: true }
    }, state)
  ),
  on(fromJenkins.pipelineLoadSuccess, (state, { pipeline }) =>
    adapter.updateOne({
      id: pipeline.url,
      changes: { ...pipeline, isLoading: false }
    }, state)
  ),
  on(fromJenkins.pipelineLoadFailed, (state, { url, loadError }) =>
    adapter.updateOne({
      id: url,
      changes: { loadError, isLoading: false }
    }, state)
  )
);

export function reducer(state: State | undefined, action: Action) {
  return pipelineReducer(state, action);
}

export const getSelectedPipelineUrl = (state: State) => state.selectedPipeline;

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectPipelineIds = selectIds;
export const selectPipelineEntities = selectEntities;
export const selectAllPipelines = selectAll;
export const selectPipelineTotal = selectTotal;
