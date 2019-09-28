import { ApplicationFormManager } from "./smart_framework/applicationForm/ApplicationFormManager";
import MySmartCityServer from "./smart_framework/MySmartCityServer";
import { VenicleRegistration } from "./stadt_dortmund/applicationForms/VenicleRegistration";
import { DoUserManagement } from "./stadt_dortmund/DoUserManagement";

let manager = new ApplicationFormManager();
manager.addCategories([
    {
        categoryId: "kfz",
        categoryName: "Kraftfahrzeuge",
        forms: {
            "register": VenicleRegistration
        }
    }
]);

new MySmartCityServer(3000, "mongodb://localhost:27017", "mysmartcity")
    .useCors()
    .useUserManager(new DoUserManagement("users", "tokens"))
    .useApplicationForms(manager)
    .start();