import { Component,ViewChild } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { CompleterService, CompleterData, CompleterItem, CompleterCmp } from 'ng2-completer';
import { LocalStorageService } from 'angular-2-local-storage';

//providers
import { UserRequestManager } from '../../providers/user-request-manager';
export interface PromptModel {
  title:string;
  message:string;
  
}
@Component({  
    selector: 'confirmCancellation',
    template: `<div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    
              </div>
                   <div class="modal-body">
                      {{message}}
                  <div>
                   <div class="modal-footer">
                     <button type="button" class="btn btn-primary" (click)="afterCancellation()">OK</button>
                   </div>
              </div>
              </div>`
              
})
export class confirmCancellationPopupComponent extends DialogComponent<PromptModel, boolean> implements PromptModel {
  title: string;
  message: string;
 
  constructor(dialogService: DialogService) {
    super(dialogService);
   
  }
  afterCancellation(data) {
    this.close();
  }
}