
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


// IMPORTS: NODE.JS CORE
import {EventEmitter} from 'events';

import { difference } from 'lodash';
import { cloneDeep } from 'lodash';
import { isObject } from 'lodash';
import { isEmpty } from 'lodash';
import { forEach } from 'lodash';
import { values } from 'lodash';
import { first } from 'lodash';
import { merge } from 'lodash';
import { find } from 'lodash';
import { omit } from 'lodash';
import { keys } from 'lodash';
import { has } from 'lodash';

const hydrated = 'hydrated';
const update = 'update';

/**
 * The representation manager deals with cache balancing and data storage for
 * devices and structures relative to the WWN API. The reprenstation manager is
 * meant to attach to a network manager instance and keep an accurate cache of
 * device/structure state.
 * @class NestRepresentationManager
 * @extends EventEmitter
 * @property {Object} EMITABLE_EVENTS - a map of events emitted by this class
 * @property {Object} localDeviceCache - a two-level map where deviceType is the first key and is object containing all related devices keyed by device id.
 * @property {Object} localStructureCache - a replica map of the structure output from the WWN API
 * @property {Boolean} hydrated - a boolean indicating whether or not the RepresentationManager has been 'hydrated' (inited) by a Network Manager.
 */

@Injectable()
export class NestRepresentationManager extends EventEmitter {

    // Observables.
    private _hydratedDevices$: BehaviorSubject<Object>;
    public hydratedDevices$: Observable<Object>;

    private _EMITABLE_EVENTS: any;
    private _localDeviceCache: any;
    private _localStructureCache: any;
    private _hydrated: boolean;

    /** @constructor */
    constructor() {

        super();

        this._EMITABLE_EVENTS = {
            hydrated
            , update
        };

        this._localDeviceCache = {};
        this._localStructureCache = {};
        this._hydrated = false;

        this._hydratedDevices$ = new BehaviorSubject(new Object());

        this.hydratedDevices$ = this._hydratedDevices$.asObservable();

    };

    /**
     * Emits the hydrated event.
     * @private
     * @memberof NestRepresentationManager
     * @method _emitHydratedEvent
     * @fires NestRepresentationManager#hydrated
     */
    private _emitHydratedEvent() {

        super.emit(
            this._EMITABLE_EVENTS.hydrated
            , {
                devices: cloneDeep(this._localDeviceCache)
                , structures: cloneDeep(this._localStructureCache)
            }
        );
    }

    /**
     * Emits the update event.
     * @private
     * @memberof NestRepresentationManager
     * @method _emitUpdateEvent
     * @fires NestRepresentationManager#update
     */
    private _emitUpdateEvent() {

        super.emit(
            this._EMITABLE_EVENTS.update
            , {
                devices: cloneDeep(this._localDeviceCache)
                , structures: cloneDeep(this._localStructureCache)
            }
        );
    }

    /**
     * Adds the given function as a listener to the hydrated event.
     * @public
     * @memberof NestRepresentationManager
     * @method addHydratedListener
     * @returns {NestRepresentationManager} - the representation manager instance so that calls can be chained
     */
    public addHydratedListener() {

        super.on(
            this._EMITABLE_EVENTS.hydrated
            , this._onHydrateCallback
        );

        if (this._hydrated === true) {

            this._onHydrateCallback(this._localDeviceCache);
        }

        return this;
    }

    /**
     * Adds the given function as a listener to the update event.
     * @public
     * @memberof NestRepresentationManager
     * @method addUpdateListener
     * @returns {NestRepresentationManager} - the representation manager instance so that calls can be chained
     */
    public addUpdateListener() {

        super.on(
            this._EMITABLE_EVENTS.update
            , this._onUpdateCallback
        );

        return this;
    }

    /**
     * Removes the given function as a listener to the hydrated event.
     * @public
     * @memberof NestRepresentationManager
     * @method removeHydratedListener
     * @param {Function} fnCallback - the function to be removed from the event emission callback chain
     * @returns {NestNetworkManager} - the representation manager instance so that calls can be chained
     */
    public removeHydratedListener(callbackFn) {

        super.removeListener(
            this._EMITABLE_EVENTS.hydrated
            , callbackFn
        );
    }

    /**
     * Removes the given function as a listener to the update event.
     * @public
     * @memberof NestRepresentationManager
     * @method removeUpdateListener
     * @param {Function} fnCallback - the function to be removed from the event emission callback chain
     * @returns {NestNetworkManager} - the representation manager instance so that calls can be chained
     */
    public removeUpdateListener(callbackFn) {

        super.removeListener(
            this._EMITABLE_EVENTS.update
            , callbackFn
        );
    }

    /**
     * Returns the device cache
     * @public
     * @memberof NestRepresentationManager
     * @method getAllDevices
     * @returns {Object} - a copy of the instances localDeviceCache property
     */
    public getAllDevices() {

        return cloneDeep(this._localDeviceCache);
    }

    /**
     * Returns the structure cache
     * @public
     * @memberof NestRepresentationManager
     * @method getAllStructures
     * @returns {Object} - a copy of the instances localStructureCache property
     */
    public getAllStructures() {

        return cloneDeep(this._localStructureCache);
    }

    /**
     * Searches for a device in the local cache on the 'name' property. If
     * multiple devices are found with the same name the function will return
     * an array of these devices, otherwise it will return just the singular
     * device object if only one result is found or will return null if a device
     * cannot be found in the cache under the given name.
     * @public
     * @memberof NestRepresentationManager
     * @method getDeviceByName
     * @param {String} stringName - the string to search with
     * @returns {Array<Object>|Object|Null} - An array of devices if multiple instances are found,
     *  a singular device object if only one is found or null if no matches are found
     */
    public getDeviceByName(stringName: string) {

        var results = [];

        forEach(
            this._localDeviceCache
            , function (deviceTypeMap, deviceType) {

                var mapValues = values(deviceTypeMap);
                var isInMap = find(mapValues, { name: stringName });

                if (isInMap) {

                    results.push(cloneDeep(isInMap));
                }
            }
        );

        if (results.length === 0) {

            return null;
        } else if (results.length === 1) {

            return first(results);
        }

        return results;
    }

    /**
     * Searches for a device in the local cache based on the device id. Will
     * only return null if a device cannot be found with the given id; will
     * otherwise return the device object if found.
     * @public
     * @memberof NestRepresentationManager
     * @method getDeviceById
     * @param {String} stringId - the string to search with
     * @returns {Object|Null} - The device object if a match if found, otherwise Null indicating a match could not be found.
     */
    public getDeviceById(stringId) {

        var returnValue = null;

        forEach(
            this._localDeviceCache
            , function (deviceTypeMap, deviceType) {

                var mapValues = values(deviceTypeMap);
                var isInMap = find(mapValues, { device_id: stringId });

                if (isInMap) {

                    returnValue = cloneDeep(isInMap);
                }

                return false;
            }
        );

        return returnValue;
    }

    /**
     * Handler for the NestNetworkManager serviceStreamDataUpdate event emission.
     * Will initiate cache balancing when the event is received. During the first
     * execution will emit the 'hydrated' event on the instance, indicating that
     * the instance has data and is ready to be queried.
     * @public
     * @memberof NestRepresentationManager
     * @method handleNetworkManagerStreamUpdate
     * @param {module:NestNetworkManager~event:serviceStreamDataUpdate} updateObject - a serviceStreamDataUpdate event
     * @listens module:NestNetworkManager~event:serviceStreamDataUpdate
     * @fires NestRepresentationManager#hydrated
     */
    public handleNetworkManagerStreamUpdate(updateObject: any) {
        console.info('Handling network stream update', updateObject);

        this._balanceDeviceCacheAgainstUpstream(updateObject);
        this._balanceStructureCacheAgainstUpstream(updateObject);

        if (this._hydrated === false) {

            this._hydrated = true;
            this._emitHydratedEvent();
        } else {

            this._emitUpdateEvent();
        }
    }


    private _balanceStructureCacheAgainstUpstream(updateObject: any) {

        if (!isObject(updateObject)
            || !has(updateObject, ['body', 'data', 'structures'])) {

            // the update does not have any devices to update against; defer

            return;
        } else if (isEmpty(updateObject.body.data.structures)) {

            // reset the cache
            this._localStructureCache = {};

            return;
        }

        var upstreamStructures = updateObject.body.data.structures;
        var newLocalStructureCache = cloneDeep(this._localStructureCache);

        newLocalStructureCache = omit(
            newLocalStructureCache
            , difference(
                keys(newLocalStructureCache)
                , keys(upstreamStructures)
            )
        );

        this._localStructureCache = merge(
            {}
            , newLocalStructureCache
            , upstreamStructures
        );
    }

    // Updates observable when device cache is hydrated.
    private _onHydrateCallback(deviceCache: Object) {

        this._hydratedDevices$.next(deviceCache);

    };

        // Updates observable when device cache is updated.
    private _onUpdateCallback(deviceCache: Object) {

        this._hydratedDevices$.next(deviceCache);

    };

    /**
     * Takes a PUT stream event container and attempts to balance the local
     * device cache against the upstream data emission. If the upstream data
     * emission is applicable the function will set the instances
     * localDeviceCache property to the newly balanced cache.
     * @private
     * @memberof NestRepresentationManager
     * @method _balanceDeviceCacheAgainstUpstream
     * @param {NestServiceStreamEventContainer} updateObject - an instance of the NestServiceStreamEventContainer class
     */
    private _balanceDeviceCacheAgainstUpstream(updateObject: any) {

        if (!isObject(updateObject)
            || !has(updateObject, ['body', 'data', 'devices'])) {

            // the update does not have any devices to update against; defer

            return;
        } else if (isEmpty(updateObject.body.data.devices)) {

            // reset the cache
            this._localDeviceCache = {};

            return;
        }

        var upstreamDevices = updateObject.body.data.devices;
        var newLocalCache = cloneDeep(this._localDeviceCache);

        // first balance at the top-level since going from 1 device of x type
        // to no devices of x type removes the device type key in the map itself.
        newLocalCache = omit(
            newLocalCache
            , difference(
                keys(newLocalCache)
                , keys(upstreamDevices)
            )
        );

        forEach(
            upstreamDevices
            , function (deviceCategoryMap, deviceTypeKey) {

                var representationKeysToRemove = [];
                var representationKeysToAdd = [];
                var representationKeysTheSame = [];

                // when the upstream goes from zero to at least one of a type of
                // device then the key will be "new" and require initing
                if (!has(newLocalCache, deviceTypeKey)) {

                    newLocalCache[deviceTypeKey] = {};
                }

                // second, find and remove cached info that belongs to devices
                // that no longer exist in the upstream pool
                representationKeysToRemove = difference(
                    keys(newLocalCache[deviceTypeKey])
                    , keys(deviceCategoryMap)
                );
                newLocalCache[deviceTypeKey] = omit(
                    newLocalCache[deviceTypeKey]
                    , representationKeysToRemove
                );

                forEach(
                    newLocalCache[deviceTypeKey]
                    , function (deviceValue, deviceKey) {

                        if (has(deviceCategoryMap, deviceKey)) {

                            newLocalCache[deviceTypeKey][deviceKey] = merge(
                                {}
                                , newLocalCache[deviceTypeKey][deviceKey]
                                , deviceCategoryMap[deviceKey]
                            );
                        }
                    }
                );

                // lastly, find all representations that may have newly appeared
                // in the upstream pool and store that info
                representationKeysToAdd = difference(
                    keys(deviceCategoryMap)
                    , keys(newLocalCache[deviceTypeKey])
                );

                for (var i = 0; i < representationKeysToAdd.length; i++) {

                    newLocalCache[deviceTypeKey]
                    [representationKeysToAdd[i]] = cloneDeep(
                        deviceCategoryMap[representationKeysToAdd[i]]
                    );

                    newLocalCache[deviceTypeKey][representationKeysToAdd[i]]._deviceType = deviceTypeKey;
                }
            }
        );

        this._localDeviceCache = newLocalCache;
    }

}
