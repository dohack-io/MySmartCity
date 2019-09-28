sap.ui.define([
    "sap/ui/base/Object"
], function (Object) {
    "use strict";

    return Object.extend("sap.ui.demo.basicTemplate.utils.APIManager", {

        constructor: function (baseUrl) {
            this.baseUrl = baseUrl;
        },

        _fetch: async function (sUrl, sMethod, oBody) {
            var useData = undefined;
            var headers = {};

            if (!sMethod) {
                sMethod = "GET";
            }

            if (oBody) {
                useData = JSON.stringify(oBody);
                headers["Content-Type"] = "application/json";
            }

            return (await fetch(this.baseUrl+sUrl, {
                method: sMethod,
                headers,
                body: useData
            })).json();
        },

        getApplicationFormTree: function () {
            return this._fetch("/applicationForms/list");
        },

        getApplicationForm: function (fullFormId) {
            return this._fetch("/applicationForms/" + fullFormId);
        },

        submitApplicationForm: function (fullFormId, data) {
            return this._fetch("/applicationForms/" + fullFormId, "POST", data);
        },

        getNotifications: function () {
            return this._fetch("/notifications");
        },

        getCalendarDates: function () {
            return this._fetch("/calendar");
        }

    });
});