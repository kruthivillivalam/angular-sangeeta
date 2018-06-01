import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

export interface PromptModel {
  title:string;
  note:string;
  isoptions:boolean;
  issize:boolean;
  options:any;
  menuId:any;
  message:any;
  updatedData:any;
}

@Component({
  selector: 'prompt',
  template: `<div class="modal-dialog" [ngClass]="{'hide-left-popup':isoptions == 0 && issize == 0}">
                  <div class="modal-content add-comment-popup-content">
                    <div class="modal-header">
                      <div class="popup-title-wrap">
                        <img src="../images/comment-icon.png">
                        <span>{{title}}</span>
                      </div>
                      <button type="button" class="close" (click)="close()">&times;</button>
                    </div>
                    <div class="modal-body">
                      <div class="popup-conent-section">
                        <div class="popup-left-section" *ngIf="isoptions != 0 || issize != 0">
                          <div *ngIf="isoptions != 0">
                            <div *ngFor="let item of options.optionGroups">
                              <div class="left-section-title">{{item.optionGroupName}}</div>
                              <div class="modifier-selection-wrap grey-checkbox">
                                <div class="modifier-selection-checkbox" *ngFor="let inneritem of item.optionItems">
                                  <label>
                                    <div class="input-rc">
                                      <input type="checkbox" name="optionsCheck" value="{{inneritem.optionitemname}}" [(ngModel)]="inneritem.checked" [checked]="inneritem.checked" (click)="addOptions($event);">
                                      <span class="input-rc-span">
                                      </span>{{inneritem.optionitemname}}
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div *ngIf="issize != 0">
                            <div class="left-section-title">Size</div>
                            <div class="modifier-selection-wrap grey-checkbox">
                              <div class="modifier-selection-checkbox" *ngFor="let item of options.size">
                                <label>
                                  <div class="input-rc">
                                    <input type="radio" name="sizeCheck" value="{{item.id}}" [(ngModel)]="item.id" (click)="addSizes($event,item);">
                                    <span class="input-rc-span"></span>{{item.size_name}}
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>

                        </div>
                        <div class="popup-right-section">
                          <div class="item-details-wrap">
                            <div class="item-name op-icon op-veg">
                              <a href="javascript:void(0);">{{title}}</a>
                              <div class="menu-ingredients">{{note}}</div>
                            </div>
                            <div class="extra-note-wrap">
                              <textarea rows="4" cols="30" placeholder="Extra Note" [(ngModel)]="message" name="name"></textarea>
                            </div>
                            <div class="modal-footer">
                             <button type="button" class="btn btn-primary submit-btn" (click)="apply()">OK</button>
                             <button type="button" class="btn btn-default cancel-btn" (click)="close()" >Cancel</button>
                           </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`
})
export class PromptComponent extends DialogComponent<PromptModel, string> implements PromptModel {
  title: string;
  question: string;
  message: string = '';
  note:string;
  isoptions:boolean;
  issize:boolean;
  options:any;
  menuId:any;
  optionsCheck:any;
  optionsArr:any=[];
  sizesArr:any;
  result:any=[];
  selectedOptions:any=[];
  updatedData:any;
  constructor(dialogService: DialogService) {
    super(dialogService);
  }
  addOptions(event){

    console.log('updatedData',this.updatedData);

    if(event.target.checked) {
      this.optionsArr.push(event.target.value);
      if(this.updatedData != null || this.updatedData != undefined) {
        this.updatedData[0].optionsArr.push(event.target.value);
      }
    } else {
      this.optionsArr.pop(event.target.value);
      if(this.updatedData != null || this.updatedData != undefined) {
        this.updatedData[0].optionsArr.pop(event.target.value);
      }
    }
    console.log(event.target.checked)
  }

  addSizes(event,item) {
    if(event.target.checked) {
      console.log('item',item);
      if(this.updatedData != null || this.updatedData != undefined) {
        this.updatedData[0].sizesArr = event.target.value;
      }
      this.sizesArr = item.size_name;
    }
    console.log(event.target.checked)
  }
  apply() {
    console.log('options',this.options);
    console.log('optionsArr',this.optionsArr);
    console.log('sizesArr',this.sizesArr);
    console.log('updatedData',this.updatedData);

    if(this.updatedData != null || this.updatedData != undefined) {
      if(this.updatedData.length > 0) {
        this.optionsArr = this.updatedData[0].optionsArr;
        this.sizesArr = this.updatedData[0].sizesArr;
      }
    }
    this.result.push({
      'message':this.message,
      'optionsArr':this.optionsArr,
      'sizesArr':this.sizesArr,
      'menuId':this.menuId
    })

    // this.result = this.message;
    this.close();
  }
}
