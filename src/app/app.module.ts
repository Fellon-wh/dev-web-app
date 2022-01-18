import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule } from './module/NgZorroAntd.module';
import { ReportDesignerComponent } from './pages/Report/ReportDesigner/ReportDesigner.component';
import { ReportMaskerComponent } from './pages/Report/ReportMasker/ReportMasker.component';
import { ReportTemplateComponent } from './pages/Report/ReportTemplate.component';
import { ReportToolbarComponent } from './pages/Report/ReportToolbar/ReportToolbar.component';
import { ResizerColumnComponent } from './pages/Report/ResizerColumn/ResizerColumn.component';
import { ResizerRowComponent } from './pages/Report/ResizerRow/ResizerRow.component';
import { RichTextComponent } from './pages/Report/RichText/RichText.component';
import { SelectorContainerComponent } from './pages/Report/SelectorContainer/SelectorContainer.component';

@NgModule({
  declarations: [
    AppComponent,

    ReportTemplateComponent,
    ReportToolbarComponent,
    ReportDesignerComponent,
    ReportMaskerComponent,
    SelectorContainerComponent,
    RichTextComponent,
    ResizerRowComponent,
    ResizerColumnComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,

    NgZorroAntdModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}