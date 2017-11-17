import { Injectable } from '@angular/core';
import { EmailService } from '../../providers/email-service/email-service';
import { UserService } from '../../providers/user-service/user-service';
import { ConfigService } from '../../providers/config-service/config-service';
import { DeviceModel } from '../../models/device';

@Injectable()
export class NotificationService {

    private userName: string;
    private userEmail: string;
    private cameraName: string;
    private startTime: Date;
    private nestEmailFromAddress: string;
    private nestEmailSubject: string;
    private nestEmailMessageBody: string;

    constructor(private _email: EmailService, private _user: UserService, private _config: ConfigService) { }

    public SendMotionNotification(device: DeviceModel) {

        this.userName = this._user.GetCurrentUser().name;
        this.userEmail = this._user.GetCurrentUser().email;
        this.cameraName = device.name;
        this.startTime = device.LastEvent.startTime;
        this.nestEmailFromAddress = this._config.nestEmailFromAddress;
        this.nestEmailSubject = this._SetNestEmailSubject(this._config.nestEmailSubject, this.cameraName);
        this.nestEmailMessageBody = this._SetNestEmailMessageBody(this._config.nestEmailMessageBody, this.cameraName, this.startTime);

        // Passing all the necessary parameters to execute EmailService.sendEmail method.
        this._email.SendEmail(this.userEmail, this.nestEmailFromAddress, this.nestEmailSubject, this.nestEmailMessageBody);

    }

    private _SetNestEmailSubject(emailSubjectTemplate: string, cameraName: string) {

        var emailSubject: string = emailSubjectTemplate.replace('{{camera_name}}', cameraName);
        
        return emailSubject;

    }
    
    private _SetNestEmailMessageBody(emailBodyTemplate: string, cameraName: string, startTime: Date) {

        var emailBody: string = emailBodyTemplate.replace('{{camera_name}}', cameraName);
        emailBody = emailBody.replace('{{start_time}}', startTime.toTimeString());

        return emailBody;

    }
}

