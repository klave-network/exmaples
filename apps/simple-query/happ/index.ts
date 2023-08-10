import { Notifier, JSON } from '@klave/sdk';
import { ServiceInfoOutput } from './types';

/**
 * @query
 */
export function getServiceInfo(): void {

    Notifier.sendJson<ServiceInfoOutput>({
        success: true,
        mood: "😉"
    });

}
