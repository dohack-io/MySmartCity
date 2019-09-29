import { ApplicationFormManager } from "./smart_framework/applicationForm/ApplicationFormManager";
import MySmartCityServer from "./smart_framework/MySmartCityServer";
import { VenicleRegistration } from "./stadt_dortmund/applicationForms/VenicleRegistration";
import { DoUserManagement } from "./stadt_dortmund/DoUserManagement";
import { Movement } from "./stadt_dortmund/applicationForms/Movement";
import { NotificationManager } from "./smart_framework/notifications/NotificationManager";
import CalendarManager from "./smart_framework/cityCalendar/CalendarManager";
import { SimpleTrashCalendar } from "./stadt_dortmund/SimpleTrashCalendar";
import { EventCalendar } from "./stadt_dortmund/EventCalendar";
import { BulkTrash } from "./stadt_dortmund/applicationForms/BulkTrash";
import { EmbeddedCalendarItems } from "./stadt_dortmund/EmbeddedCalendarItems";

new MySmartCityServer(3000, "mongodb://localhost:27017", "mysmartcity")
    .useCors()
    .useUserManager(new DoUserManagement("users", "tokens"))
    .useNotification(
        new NotificationManager()
            .integrateApplicationForms()
    )
    .useCalendar(
        new CalendarManager()
            .addCalendarSource(EmbeddedCalendarItems)
            .addCalendarSource(SimpleTrashCalendar)
            .addCalendarSource(EventCalendar)
    )
    .useApplicationForms(
        new ApplicationFormManager()
            .addCategories([
                {
                    categoryId: "kfz",
                    forms: {
                        "registerVenicle": VenicleRegistration
                    }
                },
                {
                    categoryId: "pers",
                    forms: {
                        "bulkTrash": BulkTrash,
                        "movement": Movement
                    }
                }
            ])
    )
    .useStaticFile("../frontend/dist")
    .start();