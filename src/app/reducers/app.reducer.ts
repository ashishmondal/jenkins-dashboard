import { createReducer, Action, on } from '@ngrx/store';
import * as fromApp from '../actions/app.actions';
import { Config } from '../models/config.model';

export interface State {
  notificationPermission: string;
}

export const initialState: State = {
  notificationPermission: 'default'
};

const appReducer = createReducer(initialState,
  on(fromApp.notifyPermission, (state, { notificationPermission }) => ({ ...state, notificationPermission }))
);

export function reducer(state: State, action: Action) {
  return appReducer(state, action);
}
