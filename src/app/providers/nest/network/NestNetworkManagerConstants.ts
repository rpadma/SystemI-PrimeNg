import { Injectable } from '@angular/core';

@Injectable()
export class EMITABLE_EVENTS {

    public serviceStreamDataUpdate: string = 'serviceStreamDataUpdate';
    public serviceStreamClosed: string = 'serviceStreamClosed';
    public authTokenRevoked: string = 'authTokenRevoked';

}

@Injectable()
export class NETWORK_STREAM_EVENTS {

    public auth_revoked: string = 'auth_revoked';
    public put: string = 'put';
    public keep_alive: string = 'keep_alive';

}

@Injectable()
export class NETWORK_ERROR_EVENTS {

    public UNDER_RATE_LIMITS: string = 'UNDER_RATE_LIMITS';
    public PATH_NOT_FOUND: string = 'PATH_NOT_FOUND';
    public API_INTERNAL_ERROR: string = 'API_INTERNAL_ERROR';
    public AUTH_ERROR: string = 'AUTH_ERROR';
    public FORBIDDEN: string = 'FORBIDDEN';
    public SERVICE_UNAVAILABLE: string = 'SERVICE_UNAVAILABLE';

}


