import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Pipeline } from 'src/app/models/jenkins.model';

@Component({
  selector: 'mui-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineComponent implements OnInit {

  @Input() pipeline: Pipeline;

  constructor() { }

  ngOnInit(): void {
  }

}
