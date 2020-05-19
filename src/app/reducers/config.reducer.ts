import { createReducer, Action, on } from '@ngrx/store';
import * as fromConfig from '../actions/app.actions';
import { Config } from '../models/config.model';

export interface State {
  config: Config;
  isLoading: boolean;
  error?: string;
}

export const initialState: State = {
  config: {
    appName: '',
    delay: 60,
    jenkins: {
      pipelines: [],
      jobs: []
    }
  },
  isLoading: false
};

const configReducer = createReducer(initialState,
  on(fromConfig.loadConfig, state => ({ ...state, isLoading: true })),
  on(fromConfig.configLoadSuccess, (state, { config }) => ({ ...state, config, isLoading: false, error: void 0 })),
  on(fromConfig.configLoadFailed, state => ({...state, isLoading: false, error: 'Error loading config'}))
);

export function reducer(state: State, action: Action) {
  return configReducer(state, action);
}
