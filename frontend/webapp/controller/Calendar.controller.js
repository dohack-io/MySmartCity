sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/unified/FileUploader",
	"../model/formatter",
	"../utils/APIManager",
	'sap/ui/unified/CalendarLegendItem',
	'sap/ui/unified/DateTypeRange',
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/json/JSONModel"
], function (MessageBox, Controller, FileUploader, formatter, APIManager, CalendarLegendItem, DateFormat, DateTypeRange, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.App", {

		formatter: formatter,

		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("home").attachPatternMatched(this.onRouteMatched.bind(this), this);
		},

		onRouteMatched: function (oEvent) {
			this.APIManager = new APIManager("http://10.4.1.121:3000");

			this.calendarModel = new JSONModel({});
			this.getOwnerComponent().setModel(this.calendarModel, "calendarModel");
			this.loadCalendarData();
			this.loadnextCalendarData();

		},
		onNavButton: function (oEvent) {
			this.getBack();
		},

		getBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("home", true);

		},
		onPressTile: function () {
			console.log("Test");
		},

		loadCalendarData: async function () {
			var oData = await this.APIManager.getCalendarDates();
			oData.forEach(function (oDataEntry) {
				oDataEntry.events.forEach(function (oEvent) {
					oEvent.start = new Date(oEvent.start);
					if (oEvent.end != null) {
						oEvent.end = new Date(oEvent.end);
					} else {
						oEvent.end = new Date(oEvent.start.getYear(), oEvent.start.getMonth(),
							oEvent.start.getDate() + 1);
					}
				});
			});
			this.calendarModel.setData(oData);
		},


		convertDate: function(oDate){
			var dateInst = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.YYYY"
			});

			var tempDate = dateInst.format(oDate);
			return tempDate;
		},

	});
});