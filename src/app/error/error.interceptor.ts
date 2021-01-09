import { TodoService } from './../services/todo.service';
import { ErrorComponent } from './error.component';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public dialog: MatDialog, private toDoService: TodoService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        this.toDoService.setLoading(false);
        let message = 'an unknown error occured!';
        if (error.error.message) {
          message = error.error.message;
        }
        this.dialog.open(ErrorComponent, { data: {message} });
        return throwError(error);
      })
    );
  }
}
