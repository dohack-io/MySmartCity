import { ACalendarSource } from "../smart_framework/cityCalendar/ACalendarSource";
import { CalendarItemResponse } from "../smart_framework/cityCalendar/CalendarItemResponse";
import { CalendarItem } from "../smart_framework/cityCalendar/CalendarItem";
import moment from "moment";
import fetch from "node-fetch";

type DoCalendarResponse = {
    startdate: string;
    enddate: string;
    title: string;
    description: string;
    link: string;
}

export class EventCalendar extends ACalendarSource {
    
    private async fetchData(): Promise<DoCalendarResponse[]> {
        let result = await fetch("https://www.dortmund.de/de_2/extern/opendata/opendata_vk.json");
        return result.json();
    }

    public async addCalendarItems(response: CalendarItemResponse): Promise<void> {
        let data = await this.fetchData();

        data.forEach(e=> {
            let converted: CalendarItem = {
                color: "#ffe800",
                description: e.description,
                start: moment(e.startdate).toDate(),
                end: moment(e.enddate).toDate(),
                link: e.link,
                title: e.title,
                tenative: true
            };
            response.addItem("City Events", converted);  
        });
    }

}