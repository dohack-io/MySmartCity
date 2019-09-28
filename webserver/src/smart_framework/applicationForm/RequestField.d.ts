export type PlainFormField<T> = {
    requestId?: string,
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

export type FormField<T> = TextField<T> | NumberField<T> | DateTimeField<T> | FileField<T>;