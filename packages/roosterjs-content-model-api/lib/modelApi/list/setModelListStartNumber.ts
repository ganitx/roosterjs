import { ContentModelDocument } from 'roosterjs-content-model-types';
import { getFirstSelectedListItem } from 'roosterjs-content-model-dom';

/**
 * Set start number of a list item
 * @param model The model document
 * @param value The number to set to, must be equal or greater than 1
 */
export function setModelListStartNumber(model: ContentModelDocument, value: number) {
    const listItem = getFirstSelectedListItem(model);
    const level = listItem?.levels[listItem?.levels.length - 1];

    if (level) {
        level.format.startNumberOverride = value;

        return true;
    } else {
        return false;
    }
}
