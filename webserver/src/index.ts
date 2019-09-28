import { ApplicationFormManager } from "./smart_framework/applicationForm/ApplicationFormManager";
import MySmartCityServer from "./smart_framework/MySmartCityServer";
import { VenicleRegistration } from "./stadt_dortmund/applicationForms/VenicleRegistration";

let manager = new ApplicationFormManager("mongodb://localhost:27017", "mysmartcity");
manager.createCategory("KFZ", {
    "register": VenicleRegistration
});

let server = new MySmartCityServer(3000);
server.useApplicationForms(manager);
server.start();