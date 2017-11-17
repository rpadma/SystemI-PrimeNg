import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { UserModel } from '../../models/user';
import { ConfigService } from '../../providers/config-service/config-service';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  private _user: UserModel;
  private _user$: BehaviorSubject<UserModel>;
  // Service consumers can subscribe to this observable to get latest app user data.
  public user$: Observable<UserModel>;

  constructor(private _http: Http, private _config: ConfigService) {

    this._user = new UserModel();
    this._user$ = new BehaviorSubject(new UserModel);
    this.user$ = this._user$.asObservable();

    // faking out user for testing.
    this._user.email = 'iiyeremu@uncc.edu';
    this._user.id = 1;
    this._user.name = 'Joe Yeremuk';

  }

  // Primary Login function.
  public Login(username: string, password: string): Observable<UserModel> {

    var credentials: any = { UserName: username, Password: password };

    return this._http.post(this._config.loginURL, credentials)
      .map(res => {
        return this._ParseUserFromJSON(res);
      });

  }

  // Retrieve currently-authenticated user.
  public GetCurrentUser() { return this._user; }

  // Convert JSON to Typed UserModel.
  private _ParseUserFromJSON(res: Response) {

    let user = res.json();

    // New instance of UserModel.
    this._user = new UserModel();

    // Set Properties.
    this._user.id = user.id;
    this._user.name = user.name;
    this._user.email = user.email;
    this._user.isLoggedIn = user.isLoggedIn;

    // Propogate user model to all subscribers.
    this._user$.next(this._user);

    // Return UserModel object.
    return this._user;

  }

}

