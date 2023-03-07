export interface Message <T> {
    content : T
    replyTo: string;
    correlationId: string;
}

type FunctionPropertyNames<T> = { 
    [K in keyof T]: T[K] extends Function ? K : never 
}[keyof T];

export type OmitFn<T> = Omit<T, FunctionPropertyNames<T>>;