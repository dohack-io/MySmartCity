sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/unified/FileUploader",
	"../model/formatter",
	"../utils/APIManager",
	'sap/ui/unified/CalendarLegendItem',
	'sap/ui/unified/DateTypeRange',
	"sap/ui/model/json/JSONModel"
], function (MessageBox, Controller, FileUploader, formatter, APIManager, CalendarLegendItem, DateTypeRange, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.App", {

		formatter: formatter,

		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("home").attachPatternMatched(this.onRouteMatched.bind(this), this);
		},

		onRouteMatched: function (oEvent) {
			this.APIManager = new APIManager("http://10.4.1.121:3000");
			this.treeModel = new JSONModel({});
			this.listModel = new JSONModel({});
			this.calendarModel = new JSONModel({});

			this.getOwnerComponent().setModel(this.treeModel, "formModel");
			this.getOwnerComponent().setModel(this.listModel, "listModel");
			this.getOwnerComponent().setModel(this.calendarModel, "calendarModel");

			this.loadTreeData();
			this.loadListData();
			this.loadCalendarData();

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
						oEvent.end = new Date(oEvent.start.getYear(),oEvent.start.getMonth(),
						oEvent.start.getDate() + 1);
					}
				});
			});
			this.calendarModel.setData(oData);
		},

		onMenuSelChanged: function (oEvent) {
			var oSelectedContext = oEvent.getParameter("listItem");
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
				location.hash = "#form/" + sFullName;
			}

		}

	});
});