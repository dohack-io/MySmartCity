export type PlainRequestField = {
    requestId?: string,
    userId?: string,
    id: string,
    label: string,
    type: string
};

export type TextField = PlainRequestField & {
    type: "text",
    maxLength?: number,
    masked?: string,
    placeholder?: string
}

export type NumberField = PlainRequestField & {
    type: "number",
    min?: number,
    max?: number,
    placeholder?: number
}

export type DateTimeField = PlainRequestField & {
    type: "dateTime",
    min?: Date,
    max?: Date,
    value?: Date
}

export type FileField = PlainRequestField & {
    type: "file",
    datatype?: string
}

export type RequestField = TextField | NumberField | DateTimeField | FileField;