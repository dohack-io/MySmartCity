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
			var oForm = this.getView().byId("FormContainer");
			oForm.addFormElement(this.addInputField("eins", "Number", "Platzhalter", "Number"));
			oForm.addFormElement(this.addInputField("zwei", "Text", "Platzhalter", "Text"));
			oForm.addFormElement(this.addFileField("drei", "FileUpload", "Platzhalter"));
			oForm.addFormElement(this.addDateTimeInput("vier", "DateTime", "Platzhalter", "2018-12-17T03:24:00", "2019-12-17T03:24:00"));


		},

		addInputField: function (isID, isLabel, isPlaceholder, isType) {
			var newFormElement = this.addFormElement(isLabel);
			var newField = new sap.m.Input(isID);
			newField.setPlaceholder(isPlaceholder)
			newField.setType(isType);
			newFormElement.addField(newField);
			return newFormElement;
		},

		addFormElement: function (isLabel) {
			var newFormElement = new sap.ui.layout.form.FormElement();
			newFormElement.setLabel(isLabel);
			return newFormElement;
		},

		addFileField: function (isID, isLabel, isPlaceholder) {
			var newFormElement = this.addFormElement(isLabel);
			var newField = new FileUploader(isID);
			newField.setPlaceholder(isPlaceholder);
			newFormElement.addField(newField);
			return newFormElement;
		},

		addDateTimeInput: function (isID, isLabel, isPlaceholder, isMinDate, isMaxDate) {
			var newFormElement = this.addFormElement(isLabel);
			var newField = new sap.m.DateTimeInput(isID);
			newField.setPlaceholder(isPlaceholder);
			newField.setType("Date");
			newFormElement.addField(newField);
			return newFormElement;
		},

		onSave: function () {
			var oForm = this.getView().byId("FormContainer");
			this.getValuesInForm(oForm);
		},

		getValuesInForm: function (oForm) {
			var aElements = oForm.getFormElements();
			aElements.forEach(function (oElement) {
				console.log(oElement.getFields()[0].getId());
				console.log(oElement.getFields()[0].getValue());
			});
		},

		onCancel: function () {
			var oForm = this.getView().byId("FormContainer");
			if (this.checkValuesInForm(oForm) == true) {
				this.checkDeleteValues();
				
				
			} else {
				this.deleteValuesInForm(oForm);
			}
		},

		checkDeleteValues: function () {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			var that = this;
			MessageBox.error(
				"Check! Delete?",
				{
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function(sAction) {
						if (sAction == MessageBox.Action.YES ){ 
							var oForm = that.getView().byId("FormContainer");
							that.deleteValuesInForm(oForm);
						} else if (sAction == MessageBox.Action.NO ){ 
						}
					}
				}
			);

		},

		deleteValuesInForm: function (oForm) {
			var aElements = oForm.getFormElements();
			aElements.forEach(function (oElement) {
				oElement.getFields()[0].setValue("");
			});
		},

		checkValuesInForm: function (oForm) {
			var rbCheckValues = false;
			var aElements = oForm.getFormElements();
			aElements.forEach(function (oElement) {
				if (oElement.getFields()[0].getValue() !== "") {
					rbCheckValues = true;

				};
			});
			return rbCheckValues;
		},







	});
});