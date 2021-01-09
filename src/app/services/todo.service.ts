import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Item } from './../todo/item.model';
import { toDoData } from './../todo/todo.model';
import { environment } from './../../environments/environment';

const BACKEND_URL = environment.apiUrl + 'todo/';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private toDoItems: Item[] = [];
  itemsUpdated = new Subject<{items: Item[], itemsCount: number}>();
  private loadingListner = new Subject<boolean>();
  private loading = false;

  constructor(private http: HttpClient, private router: Router) { }

  setLoading(flag: boolean) {
    this.loadingListner.next(flag);
  }

  getLoadingListner() {
    return this.loadingListner.asObservable();
  }
  getToDoItems(pageSize: number, currPage: number) {
    const queryParams = `?pagesize=${pageSize}&page=${currPage}`;
    this.http.get<{message: string, items: any, totalItems: number}>(BACKEND_URL + queryParams)
    .pipe(
      map(itemsData => {
        return {
          items: itemsData.items.map(item => {
            return {
              title: item.title,
              body: item.body,
              toDoDay: item.toDoDay,
              id: item._id
            };
          }),
          itemsCount: itemsData.totalItems
        };
      })
    )
    .subscribe((transformedItems) => {
      this.toDoItems = transformedItems.items;
      this.itemsUpdated.next({items: [...this.toDoItems], itemsCount: transformedItems.itemsCount});
    });
  }

  getItem(itemId: string) {
    return this.http.get<{_id: string, title: string, body: string, toDoDay: string}>(
      BACKEND_URL + itemId
    ); // returns observable (not subcribed here and will subscribe in the component)
  }

  addItem(title: string, body: string, toDoDay: string) {
    const itemData: toDoData = {title, body, toDoDay};
    this.http.post(BACKEND_URL, itemData)
    .subscribe((res: any) => {
      console.log(res);
      this.router.navigate(['/']);
    })
  }

  editItem(itemId: string, title: string, body: string, toDoDay: string) {
    const itemData: Item = {title, body, toDoDay, id: itemId};
    this.http.put(BACKEND_URL + itemId, itemData)
    .subscribe((res: any) => {
      console.log(res);
      this.router.navigate(['/']);
    })
  }

  deleteItem(itemId: string) {
    return this.http.delete<{message: string}>(BACKEND_URL + itemId);
  }


}
