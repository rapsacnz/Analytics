({
    init: function(component) {
        self = this;

        self.getUserData(component);
        self.getTrackingId(component);

    },

    getUserData: function(component) {
        var self = this;
        var action = component.get("c.getCurrentUserData");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.userdata", response.getReturnValue());
                component.set("v.userdataLoaded", true);

                self.initAnalytics(component);
            }
        });
        $A.enqueueAction(action);
    },

    getTrackingId: function(component) {
        var self = this;
        var action = component.get("c.getTrackingId");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.trackingid", response.getReturnValue());
                component.set("v.trackingidLoaded", true);

                self.initAnalytics(component);
            }
        });
        $A.enqueueAction(action);
    },

    initAnalytics: function(component) {

        if (!component.get("v.trackingidLoaded") || !component.get("v.userdataLoaded")) {
            return;
        }

        // store the name of the Analytics object
        window.GoogleAnalyticsObject = 'ga';
        // check whether the Analytics object is defined
        if (!('ga' in window)) {
            // define the Analytics object
            window.ga = function() {
                // add the tasks to the queue
                window.ga.q.push(arguments);
            };

            // create the queue
            window.ga.q = [];
        }
        // store the current timestamp
        window.ga.l = (new Date()).getTime();
        window.ga_debug = { trace: true };

        var trackingid = component.get("v.trackingid");
        var userdata = component.get("v.userdata");

        ga('create', trackingid, { 'userId': userdata.id, 'storage': 'none' });
        ga('send', 'pageview');

    }
})
