import { JSON } from '@klave/sdk';

@serializable
export class ErrorMessage {
    success!: boolean;
    message!: string;
}

@serializable
export class ServiceInfoOutput {
    success!: boolean;
    mood!: string;
}
