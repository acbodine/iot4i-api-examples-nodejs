(function() {
	var shieldUuid = <shieldUUID>;	// replace with a new UUID
	var shieldName = 'driverBehaviorShield';
	var hazardUuid = 'DrivingBehavior';
	var hazardTitle = 'An operator of the policy owner\'s vehicle is driving aggressively:';
	var delay = 20000;

	var safelet = function(payload) {
        var badBehavior = false;

        payload.d.ctx_sub_trips.forEach(function(ctx) {

            // If there aren't any items in ctx.driving_behavior_details array
            // then the Driver Behavior service didn't find any bad driving
            // behavior in this sub_trip. No need to fire the shield.
            if (ctx.driving_behavior_details.length < 1) return;

            // If there are items in the ctx.driving_behavior_details array
            // then the Driver Behavior service results contain instances of
            // observed aggressive driving. We return true here to signal that
            // this shield needs to take action.
            badBehavior = true;
        });

        return badBehavior;
	};

	var entryCondition = function(payload) {
        return payload.d && payload.d.ctx_sub_trips && payload.d.ctx_sub_trips.length > 0;
	};

	var message = function(payload) {
		payload.extra = payload.extra || {};
		payload.extra.isHandled = false;
		payload.extra.urgent = true;

		var msg = hazardTitle;
        var behaviors = [];

        // Aggregate driving behavior details from the payload.
        payload.d.ctx_sub_trips.forEach(function(ctx) {
            if (ctx.driving_behavior_details.length < 1) return;

            ctx.driving_behavior_details.forEach(function(details) {
                var b = details.behavior_name + ' detected, coordinates: ';

                b += '('+details.start_latitude+','+details.start_longitude+')';
                b += '-';
                b += '('+details.end_latitude+','+details.end_longitude+')';
                b += ', ';
                b += 'time: ';
                b += details.start_time+'-'+details.end_time;

                behaviors.push(b);
            });
        });

        msg = hazardTitle + ' ' + behaviors.join(' | ');

		return constructMessage(payload, shieldUuid, hazardUuid, msg);
	};

	registerShield(shieldUuid, shieldName, entryCondition, undefined, safelet, message, delay);
})();
