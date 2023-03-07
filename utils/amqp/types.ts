export type InternalMessage = {
    replyTo?: string;
    correlationId?: string;
}

export type Message<T> = T & InternalMessage;

type FunctionPropertyNames<T> = { 
    [K in keyof T]: T[K] extends Function ? K : never 
}[keyof T];

export type OmitFn<T> = Omit<T, FunctionPropertyNames<T>>;