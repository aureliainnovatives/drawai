import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatSliderModule} from '@angular/material/slider';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatButtonModule} from '@angular/material/button'; 
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CdkTableModule } from '@angular/cdk/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
 import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox'; // Import MatCheckboxModule
import { MatAutocompleteModule } from '@angular/material/autocomplete'; // Import MatAutocompleteModule
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PlaygroundComponent } from './components/playground/playground.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavComponent } from './components/layout/sidenav/sidenav.component';
import { SidePanelComponent } from './components/layout/side-panel/side-panel.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ToolbarComponent } from './components/layout/toolbar/toolbar.component';
import { CanvasComponent } from './components/layout/canvas/canvas.component';
import { PropertyComponent } from './components/layout/property/property.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { ExportDialogComponent } from './components/layout/toolbar/DownloadDialog/export-dialog/export-dialog.component';
import { ColorPickerModule } from 'ngx-color-picker';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    PlaygroundComponent,
    HeaderComponent,
    SidenavComponent,
    SidePanelComponent,
    ToolbarComponent,
    CanvasComponent,
    PropertyComponent,
    FooterComponent,
    ExportDialogComponent,


 
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CdkTableModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatIconModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatChipsModule,
    MatRippleModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule, // Add MatCheckboxModule to imports
    MatAutocompleteModule, // Add MatAutocompleteModule to imports
    MatProgressBarModule,
    MatTooltipModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatListModule, 
    MatToolbarModule,
    MatSidenavModule,
    MatTabsModule,
    ImageCropperModule,
    MatSliderModule,
    DragDropModule,
    NzSliderModule,
    ColorPickerModule

   ],
   exports: [
    ColorPickerModule
  ],
  providers: [CanvasComponent,
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS, } // Replace MY_DATE_FORMATS with your custom formats
    
  ],
 
  bootstrap: [AppComponent],

})
export class AppModule { }
