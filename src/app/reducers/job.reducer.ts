import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as fromApp from '../actions/app.actions';
import * as fromJenkins from '../actions/jenkins.actions';
import { Job } from '../models/jenkins.model';

export interface State extends EntityState<Job> {
  // additional entities state properties
  selectedJob: string | null;
}

export const adapter: EntityAdapter<Job> = createEntityAdapter<Job>({
  selectId: j => j.url,
});

export const initialState: State = adapter.getInitialState({
  selectedJob: null,
});

const jobReducer = createReducer(initialState,
  on(fromApp.configLoadSuccess, (state, { config }) => {
    const jobs = config.jenkins.pipelines
      .map(p => config.jenkins.jobs.map(job => ({
        name: job,
        url: `${p}job/${job}/`,
        isLoading: false
      })))
      .reduce((p, c) => [...p, ...c], []);
    return adapter.addMany(jobs, state);
  }),
  on(fromJenkins.loadJob, (state, { url }) =>
    adapter.updateOne({
      id: url,
      changes: { isLoading: true }
    }, state)
  ),
  on(fromJenkins.jobLoadSuccess, (state, { job }) =>
    adapter.updateOne({
      id: job.url,
      changes: {
        ...job,
        isLoading: false
      }
    }, state)
  ),
  on(fromJenkins.buildLoadSuccess, (state, { build }) => {
    const id = (state.ids as string[]).find(i => build.url.startsWith(i)) || '';
    return adapter.updateOne({
      id,
      changes: {
        build,
        isLoading: false
      }
    }, state);
  }
  )
);

export function reducer(state: State | undefined, action: Action) {
  return jobReducer(state, action);
}

export const getSelectedJobUrl = (state: State) => state.selectedJob;

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectJobIds = selectIds;
export const selectJobEntities = selectEntities;
export const selectAllJobs = selectAll;
export const selectJobTotal = selectTotal;
