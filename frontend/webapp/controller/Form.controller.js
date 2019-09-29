sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/unified/FileUploader",
	"../model/formatter",
	"../utils/APIManager",
	"../utils/Constants",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], function (MessageBox, MessageToast, Controller, FileUploader, formatter, APIManager, Constants, History, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.App", {

		formatter: formatter,

		onInit: function () {

			this.getOwnerComponent().getRouter().getRoute("form").attachPatternMatched(this.onRouteMatched.bind(this), this);
			this.APIManager = new APIManager(Constants.BASE_URL);
			this.formModel = new JSONModel({});
			this.getOwnerComponent().setModel(this.formModel, "formModel");

			//oForm.addFormElement(this.addInputField("eins", "Number", "Platzhalter", "Number"));
			//oForm.addFormElement(this.addFileField("drei", "FileUpload", "Platzhalter"));


		},

		onNavButton: function (oEvent) {
			this.getBack();
		},

		getBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("home", true);
		},


		onRouteMatched: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			var sFormid = oArgs.formid;
			var sCategoryId = oArgs.categoryid;
			this.oForm = this.getView().byId("FormContainer");
			this.sFullName = oArgs.categoryid + "/" + oArgs.formid;
			this.loadData(this.sFullName);
			var oTitle = this.getView().byId("title");

		},

		loadData: async function (isURL) {
			this.getView().byId("FormContainer").destroyFormElements();
			var data = await this.APIManager.getApplicationForm(isURL);
			var that = this;
			var oForm = this.getView().byId("FormContainer");


			data.forEach(function (oElement) {
				switch (oElement.type) {
					case Constants.TEXT:
						oForm.addFormElement(that.addInputField(oElement.id, oElement.label, oElement.placeholder, 'Text'));
						break;
					case Constants.NUMBER:
						oForm.addFormElement(that.addInputField(oElement.id, oElement.label, oElement.placeholder, 'Number'));
						break;

					case Constants.DATETIME:
						oForm.addFormElement(that.addDateTimeInput(oElement.id, oElement.label, oElement.placeholder, oElement.min,oElement.max));
						break;

					case Constants.DATE:
						oForm.addFormElement(that.addDateInput(oElement.id, oElement.label, oElement.placeholder, oElement.min, oElement.max));
						break;

					case Constants.FILE:
						oForm.addFormElement(that.addFileField(oElement.id, oElement.label, oElement.placeholder));
						break;
				}
			});
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
			newField.attachUploadComplete(this.uploadComplete.bind(this), this);
			newField.setSendXHR(true);
			newField.setName(Constants.FILE);
			return newFormElement;
		},

		uploadComplete: function (oEvent) {
			var sResponse = oEvent.getParameter("response");
		},

		addDateTimeInput: function (isID, isLabel, isPlaceholder, isMinDate, isMaxDate) {
			var newFormElement = this.addFormElement(isLabel);
			var newField = new sap.m.DateTimePicker(isID);
			newField.setPlaceholder(isPlaceholder);
			newFormElement.addField(newField);
			this._applyMinMaxDates(newField, isMinDate, isMaxDate);
			return newFormElement;
		},

		addDateInput: function (isID, isLabel, isPlaceholder, isMinDate, isMaxDate) {
			var newFormElement = this.addFormElement(isLabel);
			var newField = new sap.m.DatePicker(isID);
			newField.setPlaceholder(isPlaceholder);
			newFormElement.addField(newField);
			this._applyMinMaxDates(newField, isMinDate, isMaxDate);
			return newFormElement;
		},

		_applyMinMaxDates: function(fieldElement, min, max){
			if (min) {
				fieldElement.setMinDate(new Date(min));
			}
			if (max) {
				fieldElement.setMaxDate(new Date(max));
			}

		},

		onSave: function () {
			var aFormData = this.getValuesInForm(this.oForm);
			this.sendData(aFormData);
		},

		sendData: async function (iaData) {
			var aErrorData = await this.APIManager.submitApplicationForm(this.sFullName, iaData);
			if (Object.keys(aErrorData.validate).length != 0) {
				this.setErrorData(aErrorData);
			} else {
				var msg = 'Application Form is send';
				MessageToast.show(msg);
				setTimeout('', 5000);
				this.getBack();
			}
		},

		setErrorData: function (aErrorData) {
			this.oForm = this.getView().byId("FormContainer");
			var aElements = this.oForm.getFormElements();
			var requestId = aErrorData.requestId;
			this.uploadData(requestId);
			Object.keys(aErrorData.validate).forEach(oElement => {
				var oInput = sap.ui.getCore().byId(oElement);
				var sErrorText = aErrorData[oElement];
				console.log(sErrorText);
				oInput.setValueStateText(sErrorText);
				oInput.setValueState(sap.ui.core.ValueState.Error
				);
			});
		},

		uploadData: function(requestId){
			var that = this;
			this.fileUploaders.forEach(function(fileUploader){
				fileUploader.setUploadUrl(that.APIManager.getBaseUrl()+"/applicationForms/"+requestId+"/"+fileUploader.getId()+"/upload");
				fileUploader.upload();
			})
		},


		getValuesInForm: function (oForm) {
			this.fileUploaders = [];
			var aElements = oForm.getFormElements();
			var aData = {};
			var that = this;
			aElements.forEach(function (oElement) {
				var sId = oElement.getFields()[0].getId();
				var oControl = sap.ui.getCore().byId(sId);
				var sType = oControl.getMetadata().getName();
				var sValue;
				switch (sType) {
					case "sap.m.DateTimePicker":
						sValue = oElement.getFields()[0].getDateValue();
						break;
					case "sap.ui.unified.FileUploader":
						that.fileUploaders.push(oElement.getFields()[0]);
						break;

					default:
						sValue = oElement.getFields()[0].getValue();
				}
				aData[sId] = sValue;
			});

			return aData;
		},

		onCancel: function () {
			if (this.checkValuesInForm(this.oForm) == true) {
				this.checkDeleteValues();


			} else {
				this.deleteValuesInForm(this.oForm);
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
					onClose: function (sAction) {
						if (sAction == MessageBox.Action.YES) {
							that.deleteValuesInForm(this.oForm);
						} else if (sAction == MessageBox.Action.NO) {
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