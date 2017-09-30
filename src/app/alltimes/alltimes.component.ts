import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, DataTable, ConfirmationService,LazyLoadEvent,Message } from "primeng/primeng";
import Dexie from 'dexie';
import { Observable } from "rxjs";
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


const MAX_EXAMPLE_RECORDS = 1000;

@Component({
  selector: 'at-alltimes',
  templateUrl: './alltimes.component.html',
  styleUrls: ['./alltimes.component.css']
})
export class AlltimesComponent implements OnInit {

  @ViewChild("dt") dt : DataTable;
  
    allTimesheetData = [];
    onTimeSheetDialog = false;
  
    allProjectNames = ['', 'Payroll App', 'Mobile App', 'Agile Times'];
  
    allProjects = this.allProjectNames.map((proj) => {
      return { label: proj, value: proj }
    });
  
    selectedRows: Array<any>;
  
    messages: Message[] = [];
    
    contextMenu: MenuItem[];
  
    mytimesheetform: FormGroup;
    recordCount : number;
  
    constructor(private apollo: Apollo,private confirmationService: ConfirmationService,private tsb: FormBuilder) {
      
     }
  
    ngOnInit() {
  
      const AllClientsQuery = gql`
      query allTimeSheets {
        allTimeSheets {
            id
            user
            project
            category
            startTime
            endTime
          }
      }`;

  
      const queryObservable = this.apollo.watchQuery({
  
        query: AllClientsQuery, pollInterval:200
  
      }).subscribe(({ data, loading }: any) => {
  
        console.log(data)
        this.allTimesheetData = data.allTimeSheets;
        this.recordCount = data.allTimeSheets.length;
  
      });

      this.mytimesheetform = this.tsb.group({
        user: ['', [Validators.required, Validators.minLength(5)]],
        project: ['', [Validators.required, Validators.maxLength(140)]],
        category: ['', Validators.required],
        startTime: ['',Validators.required],
        endTime:['',Validators.required],
        date:[new Date(),Validators.required]
      })
  
    }

    
    
    onEditComplete(editInfo) { }
    
    cancelNewTimeSheetDialog(){
      this.confirmationService.confirm({
        header: 'Cancel TimeSheet Creation',
        message: 'Cancel all changes. Are you sure?',
        accept: () => {
          this.onTimeSheetDialog = false;
          this.messages.push({ severity: 'info', summary: 'Edits Cancelled', detail: 'No changes were saved' });
        },
        reject: () => {
          this.messages.push({ severity: 'warn', summary: 'Cancelled the Cancel', detail: 'Please continue your editing' });
          console.log("False cancel. Just keep editing.");
        }
      });
  
    }

    hasFormErrors() {
      return !this.mytimesheetform.valid;
    }
    saveNewTimeSheetEntry(){
      this.onTimeSheetDialog = false;
  //    alert(JSON.stringify(this.mytimesheetform.value));

const user =this.mytimesheetform.value.user;
const project = this.mytimesheetform.value.project;
const category = this.mytimesheetform.value.category;
const startTime = this.mytimesheetform.value.startTime;
const endTime = this.mytimesheetform.value.endTime;

const createTimeSheet = gql`
  mutation createTimeSheet ($user: String!, $project: String!, $category: String!, $startTime: Int!, $endTime: Int!, $date: DateTime!) {
    createTimeSheet(user: $user, project: $project, category: $category, startTime: $startTime, endTime: $endTime, date: $date ) {
      id
    }
  }
`;

console.log(user);
this.apollo.mutate({
mutation: createTimeSheet,
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
           this.onTimeSheetDialog=false;
      this.messages.push({ severity: 'success', summary: 'Entry Created', detail: 'Your entry has been created' });
    }

    onNewTimeSheetSubmit() {
      alert(JSON.stringify(this.mytimesheetform.value));
    }
}
