import { ACalendarSource } from "../smart_framework/cityCalendar/ACalendarSource";
import { CalendarItemResponse } from "../smart_framework/cityCalendar/CalendarItemResponse";
import { AApplicationForm, GeneralRequest } from "../smart_framework/applicationForm/AApplicationForm";
import { BulkTrashData } from "./applicationForms/BulkTrash";

/**
 * CalendarSource, welche eingebette CalendarEvents liefert
 */
export class EmbeddedCalendarItems extends ACalendarSource {
    
    public async addCalendarItems(response: CalendarItemResponse): Promise<void> {
        let collection = await this.getCollection<BulkTrashData & GeneralRequest>(AApplicationForm.COLLECTION_NAME, false);

        let items = await collection.find({
            attachedEvent: {
                $ne: null
            }
        })
        .toArray();

        response.addItems("My Application Requests", items.map(e => e.attachedEvent));
    }

}