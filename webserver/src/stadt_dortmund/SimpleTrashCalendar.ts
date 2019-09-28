import { ACalendarSource } from "../smart_framework/cityCalendar/ACalendarSource";
import { CalendarItem } from "../smart_framework/cityCalendar/CalendarItem";

export class SimpleTrashCalendar extends ACalendarSource {
    
    public async getCalendarItems(): Promise<CalendarItem[]> {
        let collection = await this.getCollection<CalendarItem>("trash_calendar", false);

        let items = await collection.find({
            date: {
                $gt: new Date()
            }
        })
        .sort({
            date: 1
        })
        .toArray();

        items.forEach(c => {
            delete (c as any)._id;
        });

        return items;
    }

}