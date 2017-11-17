import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, DataTable, LazyLoadEvent, DialogModule,ConfirmationService,Message } from "primeng/primeng";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Dexie from 'dexie';
import { Observable } from "rxjs";
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const MAX_EXAMPLE_RECORDS = 1000;

@Component({
  selector: 'at-alltimes',
  templateUrl: './alltimes.component.html',
  styleUrls: ['./alltimes.component.css']
})
export class AlltimesComponent implements OnInit {

  @ViewChild("dt") dt : DataTable;

  allTimesheetData = [];

  addEntryForm: FormGroup;

  displayEntryForm = false;

  allProjectNames = ['', 'Payroll App', 'Mobile App', 'Agile Times'];

  allProjects = this.allProjectNames.map((proj) => {
    return { label: proj, value: proj }
  });

  selectedRows: Array<any>;

  contextMenu: MenuItem[];

  recordCount : number;

  display: boolean = false;

  constructor(private apollo: Apollo, private fb: FormBuilder,private confirmationService: ConfirmationService) { }

 

  ngOnInit() {
    this.addEntryForm = this.fb.group({
      User: ['', [Validators.required]],
      Project: ['', [Validators.required]],
      Category: ['', [Validators.required]],
      StartTime: ['', [Validators.required]],
      EndTime: ['', [Validators.required]]
    })

    const AllClientsQuery = gql`
    query allTimesheets {
      allTimesheets {
          id
          user
          project
          category
          startTime
          endTime
        }
    }`;
    

    const queryObservable = this.apollo.watchQuery({

      query: AllClientsQuery,
      pollInterval:200

    }).subscribe(({ data, loading }: any) => {

      this.allTimesheetData = data.allTimesheets;
      this.recordCount = data.allTimesheets.length;

    });

  }
  onEditComplete(editInfo)
  {
    

  }
  onSaveComplete() {
        const user = this.addEntryForm.value.User;
        const project = this.addEntryForm.value.Project;
        const category = this.addEntryForm.value.Category;
        const startTime = this.addEntryForm.value.StartTime;
        const endTime = this.addEntryForm.value.EndTime;
    
        const createTimesheet = gql`
          mutation createTimesheet ($user: String!, $project: String!, $category: String!, $startTime: Int!, $endTime: Int!, $date: DateTime!) {
            createTimesheet(user: $user, project: $project, category: $category, startTime: $startTime, endTime: $endTime, date: $date ) {
              id
            }
          }
        `;
    
        this.apollo.mutate({
          mutation: createTimesheet,
          variables: {
            user: user,
            project: project,
            category: category,
            startTime: startTime,
            endTime: endTime,
            date: new Date()
          }
        }).subscribe(({ data }) => {
          console.log('got data', data);
          
        }, (error) => {
          console.log('there was an error sending the query', error);
        });
        this.displayEntryForm = false;
      }
      messages: Message[] = [];

      cancelDialog() {
       
            this.confirmationService.confirm({
              header: 'Cancel Time Creation',
              message: 'Cancel all changes. Are you sure?',
              accept: () => {
                
                //this.displayEditDialog = false;
                this.displayEntryForm = false;
                this.messages.push({ severity: 'info', summary: 'Edits Cancelled', detail: 'No changes were saved' });
              },
              reject: () => {
                this.displayEntryForm = true;
                this.onSaveComplete();
                this.messages.push({ severity: 'warn', summary: 'Cancelled the Cancel', detail: 'Please continue your editing' });
                //console.log("False cancel. Just keep editing.");
              }
            });
        
        
          }

}
