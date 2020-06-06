export interface Pipeline {
  displayName?: string;
  isLoading: boolean;
  jobs?: string[];
  loadError?: string;
  url: string;
}

export interface Job {
  build?: Build;
  isLoading: boolean;
  lastBuild?: Build;
  name: string;
  url: string;
}

export interface Build {
  actions: BuildAction[];
  building: boolean;
  culprits: Culprit[];
  displayName: string;
  duration: number;
  estimatedDuration: number;
  fullDisplayName: string;
  result: string;
  timestamp: number;
  triggeredBy: string;
  url: string;
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

export interface Culprit {
  absoluteUrl: string;
  fullName: string;
}

