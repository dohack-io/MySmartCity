sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/unified/FileUploader",
	"../model/formatter",
	"../utils/APIManager",
	"../utils/Constants",
	'sap/ui/unified/CalendarLegendItem',
	'sap/ui/unified/DateTypeRange',
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/json/JSONModel"
], function (MessageBox, Controller, FileUploader, formatter, APIManager, Constants, CalendarLegendItem, DateFormat, DateTypeRange, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.App", {

		formatter: formatter,

		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute(Constants.HOME).attachPatternMatched(this.onRouteMatched.bind(this), this);
		},

		onRouteMatched: function (oEvent) {
			this.APIManager = new APIManager(Constants.BASE_URL);
			this.treeModel = new JSONModel({});
			this.listModel = new JSONModel({});
			this.calendarModel = new JSONModel({});

			this.getOwnerComponent().setModel(this.treeModel, Constants.TREEMODEL);
			this.getOwnerComponent().setModel(this.listModel, Constants.LISTMODEL);
			this.getOwnerComponent().setModel(this.calendarModel, Constants.CALENDARMODEL);

			this.loadTreeData();
			this.loadListData();
			this.loadCalendarData();
			this.loadnextCalendarData();

		},

		onPressTile: function () {
			location.hash = "#"+Constants.CALENDAR+"/";
		},
		loadTreeData: async function () {
			var data = await this.APIManager.getApplicationFormTree();

			var result = [];
			for (var category of Object.keys(data)) {
				var item = {
					text: category,
					nodes: data[category].map((e) => {
						return {
							text: e.applicationFormTitle,
							tooltip: e.applicationFormDescription,
							fullName: e.fullName
						}
					})
				};

				result.push(item);
			}

			this.treeModel.setData(result);
		},

		loadListData: async function () {
			var data = await this.APIManager.getNotifications();
			this.listModel.setData(data);
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

		loadnextCalendarData: async function () {
			var oData = await this.APIManager.getNextDates(3);
			var counter = 1;
			var that = this;
			oData.forEach(function (oDataEntry) {
				oDataEntry.start = new Date(oDataEntry.start);
				if (oDataEntry.end != null) {
					oDataEntry.end = new Date(oDataEntry.end);
				} else {
					oDataEntry.end = new Date(oDataEntry.start.getYear(), oDataEntry.start.getMonth(),
						oDataEntry.start.getDate() + 1);
				}
				var tilecontent = that.getView().byId(Constants.TILECONTENT + counter);

				tilecontent.setFooter(that.convertDate(oDataEntry.start));
				var newscontent = that.getView().byId(Constants.NEWSCONTENT + counter);
				newscontent.setContentText(oDataEntry.description);
				newscontent.setSubheader(oDataEntry.title);
				counter++;
			});

		},

		convertDate: function(oDate){
			var dateInst = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.YYYY"
			});

			var tempDate = dateInst.format(oDate);
			return tempDate;
		},



		onMenuSelChanged: function (oEvent) {
			var oSelectedContext = oEvent.getParameter(Constants.LISTITEM);
			var sTitle = oSelectedContext.getTitle();
			var sFullName;
			var oModelData = this.treeModel.getData();
			oModelData.forEach(function (oData) {
				oData.nodes.forEach(function (oNode) {
					if (sTitle === oNode.text) {
						sFullName = oNode.fullName;
					}

				});
			});
			if (sFullName) {
				location.hash = "#"+Constants.FORM+"/" + sFullName;
			}

		}

	});
});