import { NestCamEventModel } from './nestcam-event';

// Model class for holding NestCam information.
export class DeviceModel {

    public id: string;
    public name: string;
    public snapshotURL: string;
    public appURL: string;
    public webURL: string;
    public liveFeedURL: string;
    public isOnline: boolean;
    public isStreaming: boolean;
    public isAudioEnabled: boolean;
    public lastIsOnlineActivity: Date;
    public embededIframe: string;

    public hasNewEvent: boolean;
    public LastEvent: NestCamEventModel;

}

