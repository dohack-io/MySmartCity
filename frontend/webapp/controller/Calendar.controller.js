sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/unified/FileUploader",
	'sap/ui/core/Fragment',
	"../model/formatter",
	"../utils/APIManager",
	'sap/ui/unified/CalendarLegendItem',
	'sap/ui/unified/DateTypeRange',
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/json/JSONModel"
], function (MessageBox, Controller, FileUploader, Fragment, formatter, APIManager, CalendarLegendItem, DateFormat, DateTypeRange, JSONModel) {
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

		},
		onNavButton: function (oEvent) {
			this.getBack();
		},

		getBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("home", true);

		},
		handleAppointmentSelect: function (oEvent) {
			var oAppointment = oEvent.getParameter("appointment");

			if (oAppointment) {
				this._handleSingleAppointment(oAppointment);
			}
		},

		_handleSingleAppointment: function (oAppointment) {
			if (oAppointment === undefined) {
				return;
			}

			if (!oAppointment.getSelected()) {
				this._oDetailsPopover.close();
				return;
			}

			if (!this._oDetailsPopover) {
				this._oDetailsPopover = Fragment.load({
					id: "myPopoverFrag",
					name: "sap.ui.demo.basicTemplate.view.CalendarDetail",
					controller: this
				}).then(function (oDialog) {
					this._oDetailsPopover = oDialog;
					this._setDetailsDialogContent(oAppointment);

				}.bind(this));
			} else {
				this._setDetailsDialogContent(oAppointment);
			}

		},
		_setDetailsDialogContent: function(oAppointment){
			var oTextStart = Fragment.byId("myPopoverFrag", "startDate"),
				oTextEnd = Fragment.byId("myPopoverFrag", "endDate"),
				oAppBindingContext = oAppointment.getBindingContext(),
				oMoreInfo = Fragment.byId("myPopoverFrag", "moreInfo"),
				oDetailsPopover = Fragment.byId("myPopoverFrag","detailsPopover");

			this._oDetailsPopover.setBindingContext(oAppBindingContext);
			this._oDetailsPopover.openBy(oAppointment);

			oTextStart.setText(this.convertDate(oAppointment.getStartDate()));
			oTextEnd.setText(this.convertDate(oAppointment.getEndDate()));
			oMoreInfo.setText(oAppointment.getText());
			oDetailsPopover.setTitle(oAppointment.getTitle());
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


		convertDate: function (oDate) {
			var dateInst = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.YYYY"
			});

			var tempDate = dateInst.format(oDate);
			return tempDate;
		},


	});
});