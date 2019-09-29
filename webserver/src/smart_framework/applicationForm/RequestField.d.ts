import { ObjectID } from "bson";

export type PlainFormField<T> = {
    _id?: ObjectID,
    userId?: string,
    id: keyof T,
    label: string,
    type: string
};

export type TextField<T> = PlainFormField<T> & {
    type: "text",
    maxLength?: number,
    masked?: string,
    placeholder?: string
}

export type NumberField<T> = PlainFormField<T> & {
    type: "number",
    min?: number,
    max?: number,
    placeholder?: number
}

export type DateField<T> = PlainFormField<T> & {
    type: "date",
    min?: Date,
    max?: Date,
    value?: Date
}

export type DateTimeField<T> = PlainFormField<T> & {
    type: "dateTime",
    min?: Date,
    max?: Date,
    value?: Date
}

export type FileField<T> = PlainFormField<T> & {
    type: "file",
    datatype?: string
}

export type FormField<T> = TextField<T> | NumberField<T> | DateTimeField<T> | DateField<T> | FileField<T>;