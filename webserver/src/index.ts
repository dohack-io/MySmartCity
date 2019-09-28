import { ApplicationFormManager } from "./smart_framework/applicationForm/ApplicationFormManager";
import MySmartCityServer from "./smart_framework/MySmartCityServer";
import { VenicleRegistration } from "./stadt_dortmund/applicationForms/VenicleRegistration";

let manager = new ApplicationFormManager("mongodb://localhost:27017", "mysmartcity");
manager.addCategories([
    {
        categoryId: "kfz",
        categoryName: "Kraftfahrzeuge",
        forms: {
            "register": VenicleRegistration
        }
    }
]);

new MySmartCityServer(3000)
    .useCors()
    .useApplicationForms(manager)
    .start();