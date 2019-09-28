sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/unified/FileUploader",
	"../model/formatter"
], function (MessageBox, Controller, FileUploader, formatter) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.App", {

		formatter: formatter,

		onInit: function () {
			var oTree = this.getView().byId("tree");
			oTree.addItem(this.addTreeItem("Test","Testttiel"));
			oTree.addItem(this.addTreeItem("Test2","Testttiel2"));
			//oTree.expandToLevel(0);
			//oTree.setSelectionMode(sap.ui.table.SelectionMode.Single);
		},

		addTreeItem: function (isId,isTitle) {
			var oItem = new sap.m.StandardTreeItem(isId);
			oItem.setTitle(isTitle);
			return oItem;
		}






	});
});