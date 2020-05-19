export interface Config {
  appName: string;
  delay: number;
  jenkins: JenkinsConfig;
}

export interface JenkinsConfig {
  pipelines: string[];
  jobs: string[];
}
