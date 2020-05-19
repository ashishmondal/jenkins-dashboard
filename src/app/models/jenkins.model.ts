export interface Pipeline {
  url: string;
  displayName?: string;
  jobs?: string[];
  isLoading: boolean;
  loadError?: string;
}

export interface Job {
  name: string;
  url: string;
  isLoading: boolean;
  lastBuild?: Build;
  build?: Build;
}

export interface Build {
  displayName: string;
  duration: number;
  estimatedDuration: number;
  url: string;
  building: boolean;
  triggeredBy: string;
  timestamp: number;
  result: string;
  actions: BuildAction[];
}

export interface BuildAction {
  _class: string;
}

export interface BuildCauseAction extends BuildAction {
  _class: 'hudson.model.CauseAction';
  causes: BuildCause[];
}

export interface BuildCause {
  _class: string;
}

export interface BranchIndexingCause extends BuildCause {
  _class: 'jenkins.branch.BranchIndexingCause';
  shortDescription: string;
}


export interface UserIdCause extends BuildCause {
  _class: 'hudson.model.Cause$UserIdCause';
  shortDescription: string;
  userId: string;
  userName: string;
}

export interface ReplayCause extends BuildCause {
  _class: 'org.jenkinsci.plugins.workflow.cps.replay.ReplayCause';
  shortDescription: string;
}

