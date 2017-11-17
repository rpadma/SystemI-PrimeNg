import { DeviceService } from '../providers/device-service/device-service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from "rxjs";
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'at-nestcam',
  templateUrl: './nestcam.component.html',
  styleUrls: ['./nestcam.component.css']
})
export class NestcamComponent implements OnInit {

  isStreaming: boolean;
  cameraName: string;
  //userTimeData: {camName: string,eventStart: Date,image: string}[];
  userTimeData = [];


  constructor(private apollo: Apollo, private _deviceService: DeviceService) {

    // Subscribe to devices$ Observable.
    this._deviceService.devices$.subscribe(devices => {

      const nestcams = devices;

    });

  }

  ngOnInit() {

    const AllNestCams = gql`
    query allNestCams {
      allNestCams {
          id
          name
          isStreaming
        }
    }`;

    const queryObservable = this.apollo.watchQuery({

      query: AllNestCams,
      pollInterval: 500

    }).subscribe(({ data, loading }: any) => {

      this.isStreaming = data.allNestCams[0].isStreaming;

      if (this.isStreaming) {

        this.cameraName = data.allNestCams[0].name;

      } else {

        this.cameraName = 'Offline';

      }

    });

    const AllMotionEvents = gql`
    query allMotionEvents {
      allMotionEvents {
          cameraId        
          cameraName
          eventDate
          image
        }
    }`;

    //private userTimeData:  

    
    
    const queryEvent = this.apollo.watchQuery({

      query: AllMotionEvents,
      pollInterval: 500

    }).subscribe(({ data, loading }: any) => {

      //this.isStreaming = data.AllMotionEvents[0].isStreaming;
      this.userTimeData = data.allMotionEvents;
      this.userTimeData = this.userTimeData.slice(0,4);
    });

    

  }

}
