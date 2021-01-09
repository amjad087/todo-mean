import { map } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TodoService } from './../../services/todo.service';
import { Item } from './../item.model';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  form: FormGroup;
  mode = 'create';
  item: Item;
  itemId: string;
  weekDays = [
    { value: 'Monday' },
    { value: 'Tuesday' },
    { value: 'Wednesday' },
    { value: 'Thursday' },
    { value: 'Firday' },
    { value: 'Saturday' },
    { value: 'Sunday' }
  ];
  constructor(private toDoService: TodoService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      body: new FormControl(null, {validators: [Validators.required]}),
      selectDay: new FormControl(this.weekDays[0].value, {validators: [Validators.required]})
    });

    this.activeRoute.paramMap.subscribe((paraMap: ParamMap) => {
      if (paraMap.has('itemId')) {
        this.mode = 'edit';
        this.itemId = paraMap.get('itemId');
        this.toDoService.getItem(this.itemId)
        .pipe(
          map(resData => {
            return {
              id: resData._id,
              title: resData.title,
              body: resData.body,
              toDoDay: resData.toDoDay

            };
          })
        )
        .subscribe(transformedItem => {
          this.item = transformedItem;
          this.form.setValue({
            title: transformedItem.title,
            body: transformedItem.body,
            selectDay: transformedItem.toDoDay
          });
        });
      } else {
        this.itemId = null;
        this.item = null;
        this.mode = 'create';
      }
    });
  }

  onAddItem() {
    if (!this.form.valid) {
      return;
    }
    if (this.mode === 'edit') {
      this.toDoService.editItem(this.itemId, this.form.value.title, this.form.value.body, this.form.value.selectDay);
    } else {
      this.toDoService.addItem(this.form.value.title, this.form.value.body, this.form.value.selectDay);
    }
    this.form.reset();
  }

  onCancel(){
    this.router.navigate(['/']);
  }

}
