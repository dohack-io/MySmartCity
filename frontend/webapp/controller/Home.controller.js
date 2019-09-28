sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/unified/FileUploader",
	"../model/formatter",
	"../utils/APIManager",
	"sap/ui/model/json/JSONModel"
], function (MessageBox, Controller, FileUploader, formatter, APIManager, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.App", {

		formatter: formatter,

		onInit: function () {

			this.APIManager = new APIManager("http://10.4.1.121:3000");
			this.formModel = new JSONModel({});
			this.getOwnerComponent().setModel(this.formModel, "formModel");
			this.loadData();


		},



		loadData: async function () {
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

			this.formModel.setData(result);
		},

		onMenuSelChanged: function (oEvent) {
			var oSelectedContext = oEvent.getParameter("listItem");
			var sTitle = oSelectedContext.getTitle();
			var sFullName;
			var oModelData = this.formModel.getData();
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