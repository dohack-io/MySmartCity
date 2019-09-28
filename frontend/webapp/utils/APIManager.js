sap.ui.define([
    "sap/ui/base/Object"
], function (Object) {
    "use strict";

    return Controller.extend("sap.ui.demo.basicTemplate.utils.APIManager", {

        constructor: function (baseUrl) {
            this.baseUrl = baseUrl;
        },

        _fetch: function (sUrl, sMethod, oBody) {
            var useData = undefined;
            var headers = {};

            if (!sMethod) {
                sMethod = "GET";
            }

            if (oBody) {
                useData = JSON.stringify(oBody);
                headers["Content-Type"] = "application/json";
            }

            return fetch({
                url: this.baseUrl,
                method: sMethod,
                headers,
                body: useData
            });
        },

        getApplicationFormTree: function () {
            return this._fetch("/applicationForms/list");
        },

        getApplicationForm: function (fullFormId) {
            return this._fetch("/applicationForms/" + fullFormId);
        }

        submitApplicationForm: function (fullFormId, data) {
            return this._fetch("/applicationForms/" + fullFormId, "POST", data);
        }

    });
});