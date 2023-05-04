import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { EditableListComponent } from './editable-list/editable-list.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { EditableCheckboxListComponent } from './editable-checkbox-list/editable-checkbox-list.component';
import { ListContentComponent } from './list-content/list-content.component';
import { EditableListContentComponent } from './editable-list-content/editable-list-content.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    EditableListComponent,
    CheckboxComponent,
    EditableCheckboxListComponent,
    ListContentComponent,
    EditableListContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }