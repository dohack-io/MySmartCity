import { ACalendarSource } from "../smart_framework/cityCalendar/ACalendarSource";
import { CalendarItem } from "../smart_framework/cityCalendar/CalendarItem";
import { CalendarItemResponse } from "../smart_framework/cityCalendar/CalendarItemResponse";

interface TrashCalendarItem extends CalendarItem {
    category: string;
    _id?: string;
}

export class SimpleTrashCalendar extends ACalendarSource {
    
    public async addCalendarItems(response: CalendarItemResponse): Promise<void> {
        let collection = await this.getCollection<TrashCalendarItem>("trash_calendar", false);

        let items = await collection.find({
            start: {
                $gte: new Date()
            }
        })
        .sort({
            date: 1
        })
        .toArray();

        items.forEach(c => {
            delete c._id;
            response.addItem(c.category, c);
        });
    }
}