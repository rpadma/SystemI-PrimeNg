import { Injectable } from '@angular/core';
import { ConfigModel } from '../../models/config';

@Injectable()
export class ConfigService {

  private _config: ConfigModel;

  constructor() {

    this._config = new ConfigModel();

  }

  get loginURL(): string {
    return this._config.loginURL;
  }

  // Nest API properties.
  get nestBaseAuthenticationUrl(): string {
    return this._config.nestBaseAuthenticationUrl;
  }
  set nestBaseAuthenticationUrl(value: string) {
    this._config.nestBaseAuthenticationUrl = value;
  }

  get nestBaseAPIUrl(): string {
    return this._config.nestBaseAPIUrl;
  }
  set nestBaseAPIUrl(value: string) {
    this._config.nestBaseAPIUrl = value;
  }

  get nestAuthenticationPin(): string {
    return this._config.nestAuthenticationPin;
  }
  set nestAuthenticationPin(value: string) {
    this._config.nestAuthenticationPin = value;
  }

  get nestAuthenticationToken(): string {
    return this._config.nestAuthenticationToken;
  }
  set nestAuthenticationToken(value: string) {
    this._config.nestAuthenticationToken = value;
  }

  get nestProductID(): string {
    return this._config.nestProductID;
  }
  set nestProductID(value: string) {
    this._config.nestProductID = value;
  }

  get nestProductSecret(): string {
    return this._config.nestProductSecret;
  }
  set nestProductSecret(value: string) {
    this._config.nestProductSecret = value;
  }

  // Notification email properties.
  get nestEmailFromAddress(): string {
    return this._config.nestFromAddress;
  }

  get nestEmailSubject(): string {
    return this._config.nestEmailSubject;
  }

  get nestEmailMessageBody(): string {
    return this._config.nestEmailMessageBody;
  }

  // MailGun API properties.
  set mailGunAPIKey(value: string) {
    this._config.mailGunAPIKey = value;
  }

  get mailGunAPIKey(): string {
    return this._config.mailGunAPIKey;
  }

  set mailGunDomain(value: string) {
    this._config.mailGunDomain = value;
  }

  get mailGunDomain(): string {
    return this._config.mailGunDomain;
  }

  set mailGunURL(value: string) {
    this._config.mailGunURL = value;
  }

  get mailGunURL(): string {
    return this._config.mailGunURL;
  }

}

