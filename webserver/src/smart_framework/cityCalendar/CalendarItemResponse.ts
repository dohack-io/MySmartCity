import { CalendarItem } from "./CalendarItem";

export type CalendarCategoryItem = {
    categoryName: string,
    events: CalendarItem[]
};

export class CalendarItemResponse {

    private categoricItems: Map<string, CalendarItem[]>;

    constructor() {
        this.categoricItems = new Map();
    }

    public addItems(category: string, items: CalendarItem[]) : void {
        if (!this.categoricItems.has(category)) {
            this.categoricItems.set(category, items);
        }
        else {
            let target = this.categoricItems.get(category);
            items.forEach(i => target.push(i));
        }
    }

    public addItem(category: string, item: CalendarItem) : void {
        if (!this.categoricItems.has(category)) {
            this.categoricItems.set(category, [item]);
        }
        else {
            this.categoricItems.get(category).push(item);
        }
    }

    public get items(): CalendarCategoryItem[] {
        let response = [];
        for (let categoryName of this.categoricItems.keys()) {
            response.push({
                categoryName: categoryName,
                events: this.categoricItems.get(categoryName).sort((a,b) => a.start.getTime() - b.start.getTime())
            });
        }
        return response;
    }

}