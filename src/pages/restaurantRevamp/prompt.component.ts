import { Component, Output, EventEmitter } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { AlertComponent } from '../common/alert.component';

export interface PromptModel {
  title: string;
  note: string;
  isoptions: boolean;
  issize: boolean;
  message: string;
  promptItem: any;
  showAddToCart: boolean;
}

@Component({
  selector: 'prompt',
  templateUrl: './prompt-template-new.html',
})
export class PromptComponent extends DialogComponent<PromptModel, string> implements PromptModel {

  title: string;
  note: string;
  isoptions: boolean;
  issize: boolean;
  message: string;
  promptItem: any;
  showAddToCart: boolean;
  result: any=[];
  OptNotSelected = false;
  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  addToCart() {
    this.OptNotSelected = false;
    this.checkMandatoryOptions();
    if (this.issize && !this.promptItem.sizeInfo) {
      this.dialogService.addDialog(AlertComponent, {title: 'Select Size', message: 'Please select size'});
    } else if (this.OptNotSelected) {
      this.dialogService.addDialog(AlertComponent, {title: 'Select Mandatory Option', message: 'Please select all mandatory options'});
    } else {
      this.promptItem.extraNote = this.message;
      this.result.push({
        'message': this.promptItem.extraNote,
        'updatedMenuItem' : this.promptItem,
        'addToCart' : true
      });
      this.close();
    }
  }

  checkMandatoryOptions() {
    if (this.isoptions) {
      this.promptItem.options.optionGroups.forEach(item => {
        if (item.option_selection_required_type
          && item.option_selection_required_type === 'M'
          && (!item.selected || (item.selected && item.selected === false))) {
            this.OptNotSelected = true;
          }
        });
      }
    }

    updateSizeInfo(item) {
      this.promptItem.sizeInfo = {
        id:'',
        sizeName: item.size_name,
        additionalCost: 0,
        calorie: 0,
        calorieUnit: 0
      }
      if (item) {
        if (item.id) {
          this.promptItem.sizeInfo.id = item.id;
        }
        if (item.additionalcost) {
          this.promptItem.sizeInfo.additionalCost = item.additionalcost;
          this.promptItem.unitPrice = item.additionalcost;
        }
        if (item.calorie) {
          this.promptItem.sizeInfo.calorie = item.calorie;
          this.promptItem.Calorie = item.calorie;
        }
        if (item.calorieunit) {
          this.promptItem.sizeInfo.calorieUnit = item.calorieunit;
          this.promptItem.CalorieUnit = item.calorieunit;
        }
      }
      //console.log("Size"+  JSON.stringify(this.promptItem));
    }

    onOkPressed() {
      this.OptNotSelected = false;
      this.checkMandatoryOptions();
      if (this.OptNotSelected) {
        this.dialogService.addDialog(AlertComponent, {title: 'Select Mandatory Option', message: 'Please select all mandatory options'});
      } else {
        this.promptItem.extraNote = this.message;
        this.result.push({
          'message': this.promptItem.MenuItemNote,
          'updatedMenuItem' : this.promptItem,
          'addToCart' : false
        });
        this.close();
      }
    }
  }
