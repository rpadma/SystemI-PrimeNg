import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestMethod } from '@angular/http';
import { ConfigService } from '../../providers/config-service/config-service';
import { UtilityService } from '../../providers/utility-service/utility-service';

@Injectable()
export class EmailService {

  constructor(private _http: Http, private _config: ConfigService, private _utility: UtilityService) { }

  // Generic method for sending emails via MailGun API.
  public SendEmail(
    toEmail: string,
    fromEmail: string,
    emailSubject: string,
    messageBody: string,
    attachment?: any
  ) {

    var requestHeaders = new Headers();
    var mailgunApiKey = window.btoa('api:' + this._config.mailGunAPIKey);
    requestHeaders.append('Authorization', 'Basic ' + mailgunApiKey);
    requestHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    // Sending email via http request call.
    this._http.request(new Request({
      method: RequestMethod.Post,
      url: this._config.mailGunURL + this._config.mailGunDomain + '/messages',
      body: 'from=' + fromEmail + '&to=' + toEmail + '&subject=' + emailSubject + '&text=' + messageBody,
      headers: requestHeaders
    }))
      .subscribe(success => {
        this._utility.ShowAlert('Email Sent!', JSON.stringify(success));
      }, error => {
        this._utility.ShowAlert('Error Sending Email', JSON.stringify(error));
      });

  }

}

