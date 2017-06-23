/**
 * Copyright 2016, 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var device = require( './bl/device.js');
var config = require( './config.js');

if( process.argv[3] == undefined) {
	console.log( "Username or device id missing. Syntax: node registerWallyDevice <username> <deviceid> [<location>]");
} else {
	var userName = process.argv[2];
	var deviceId = process.argv[3];
	var location = process.argv[4] || '';

	var deviceInfo = {
		'username': userName,
		'iot4i_device_id' : deviceId,
		'location' : location
	};

	device.createDevice(  config, deviceInfo, function( data, err) {
		if ( err) {
			console.log( err);
		} else {
			console.log( "Succesfully registered Wally device. Response: ");
			console.dir( data);
		}
	});
}
