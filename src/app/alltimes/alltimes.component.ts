import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, DataTable, LazyLoadEvent } from "primeng/primeng";
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
  
    allProjectNames = ['', 'Payroll App', 'Mobile App', 'Agile Times'];
  
    allProjects = this.allProjectNames.map((proj) => {
      return { label: proj, value: proj }
    });
  
    selectedRows: Array<any>;
  
    contextMenu: MenuItem[];
  
    recordCount : number;
  
    constructor(private apollo: Apollo) { }
  
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
  
        query: AllClientsQuery
  
      }).subscribe(({ data, loading }: any) => {
  
        console.log(data)
        this.allTimesheetData = data.allTimeSheets;
        this.recordCount = data.allTimeSheets.length;
  
      });
  
    }
  
    onEditComplete(editInfo) { }
  

}
