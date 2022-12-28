import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderCriterion } from './orderCriterion.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [
  ]
})
export class SearchComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();

  @Input('title')
  title: string = '';

  @Input('orderOptions')
  orderOptions: string[] = [];

  @Output()
  valueInput: EventEmitter<string> = new EventEmitter();

  @Output()
  orderSelection: EventEmitter<OrderCriterion> = new EventEmitter();

  searchControl: FormControl = new FormControl('');

  previusValue: string = '';

  constructor() {

  }
  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: string) => {
        this.changeValue(value);
      })
  }

  changeValue(value: string) {
    if (this.previusValue !== value || value === '') {
      this.previusValue = value;
      this.valueInput.emit(value);
    }
    return;
  };

  /** Criterion Order:
  *  true -> Ascendent
  *  false -> Descendent
  * **/

  selectOrderOption(option: string, criterion: boolean) {
    const order: OrderCriterion = { option, criterion }
    this.orderSelection.emit(order);
  }


}
