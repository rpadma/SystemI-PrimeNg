import { NestNetworkManagerUtils } from './providers/nest/network/NestNetworkManagerUtils';
import { EMITABLE_EVENTS, NETWORK_STREAM_EVENTS, NETWORK_ERROR_EVENTS } from './providers/nest/network/NestNetworkManagerConstants';
import { NestNetworkManager } from './providers/nest/network/NestNetworkManager';
import { NestRepresentationManager } from './providers/nest/representations/NestRepresentationManager';
import { NestApplicationInterface } from './providers/nest/NestApplicationInterface';
import { ConfigService } from './providers/config-service/config-service';
import { DeviceService } from './providers/device-service/device-service';
import { EmailService } from './providers/email-service/email-service';
import { NotificationService } from './providers/notification-service/notification-service';
import { UtilityService } from './providers/utility-service/utility-service';
import { UserService } from './providers/user-service/user-service';
import { NestcamComponent } from './nestcam/nestcam.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ApolloModule } from 'apollo-angular';
import { provideClient } from './client';

import { MenuModule, PanelModule, ChartModule,
   InputTextModule, ButtonModule, InputMaskModule,
    InputTextareaModule, EditorModule, CalendarModule,
     RadioButtonModule, FieldsetModule, DropdownModule,
      MultiSelectModule, ListboxModule, SpinnerModule,
       SliderModule, RatingModule, DataTableModule,
        ContextMenuModule, TabViewModule, DialogModule,
         StepsModule, ScheduleModule, TreeModule,
          GMapModule, DataGridModule, TooltipModule,
           ConfirmationService, ConfirmDialogModule,
            GrowlModule, DragDropModule, GalleriaModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatisticComponent } from './statistic/statistic.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';

import { AlltimesComponent } from './alltimes/alltimes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FielderrorsComponent } from './fielderrors/fielderrors.component';

// Providers



const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'alltimes', component: AlltimesComponent },
  { path: 'timesheet', component: TimesheetComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'nestcam', component: NestcamComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    StatisticComponent,
    TimesheetComponent,
    ProjectsComponent,
    AlltimesComponent,
    NestcamComponent,
    ProfileComponent,
    SettingsComponent,
    FielderrorsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    ApolloModule.forRoot(provideClient),
    BrowserAnimationsModule,
    MenuModule,
    PanelModule,
    ChartModule,
    InputTextModule,
    ButtonModule,
    InputMaskModule,
    InputTextareaModule,
    EditorModule,
    CalendarModule,
    RadioButtonModule,
    FieldsetModule,
    DropdownModule,
    MultiSelectModule,
    ListboxModule,
    SpinnerModule,
    SliderModule,
    RatingModule,
    DataTableModule,
    ContextMenuModule,
    TabViewModule,
    DialogModule,
    StepsModule,
    ScheduleModule,
    TreeModule,
    GMapModule,
    DataGridModule,
    TooltipModule,
    ConfirmDialogModule,
    GrowlModule,
    DragDropModule,
    GalleriaModule
  ],
  providers: [
    ConfirmationService,
    UserService,
    UtilityService,
    NotificationService,
    EmailService,
    DeviceService,
    ConfigService,
    NestApplicationInterface,
    NestRepresentationManager,
    NestNetworkManager,
    NestNetworkManagerUtils,
    EMITABLE_EVENTS,
    NETWORK_STREAM_EVENTS,
    NETWORK_ERROR_EVENTS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
