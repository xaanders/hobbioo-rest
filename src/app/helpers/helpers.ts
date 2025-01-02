import sanitize from 'sanitize-html';
import { IHelpers } from '../../shared/interfaces.js';

export const helpers: IHelpers = {
    generateId: () => {
        return crypto.randomUUID();
    },
    sanitize: (text: string) => {
        return sanitize(text, {
            allowedTags: [],
            allowedAttributes: {},
        });
    }
}