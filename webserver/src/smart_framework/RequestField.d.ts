export type PlainFormField = {
    requestId?: string,
    userId?: string,
    id: string,
    label: string,
    type: string
};

export type TextField = PlainFormField & {
    type: "text",
    maxLength?: number,
    masked?: string,
    placeholder?: string
}

export type NumberField = PlainFormField & {
    type: "number",
    min?: number,
    max?: number,
    placeholder?: number
}

export type DateTimeField = PlainFormField & {
    type: "dateTime",
    min?: Date,
    max?: Date,
    value?: Date
}

export type FileField = PlainFormField & {
    type: "file",
    datatype?: string
}

export type FormField = TextField | NumberField | DateTimeField | FileField;