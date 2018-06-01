import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'spinner',
  template: `<div class="modal-open" *ngIf="show">
              <div class="spinner-container" style="display:block;">
                  <img class="spinner-custom" [src]="loadingImage" />
              </div>
            </div>
  `
})
export class SpinnerComponent implements OnInit, OnDestroy{
    @Input() loadingImage = '../assets/images/loading.svg';
    @Input() name: string;
    @Input() group: string;
    @Input() show = false;

    constructor(private spinnerService: SpinnerService) {}

    ngOnInit(): void {
      if (!this.name) throw new Error("Spinner must have a 'name' attribute.");
      this.spinnerService._register(this);
    }

    ngOnDestroy(): void {
      this.spinnerService._unregister(this);
    }
  }