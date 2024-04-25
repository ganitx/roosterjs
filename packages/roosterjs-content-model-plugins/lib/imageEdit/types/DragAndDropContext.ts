import { ImageEditElementClass } from './ImageEditElementClass';
import { ImageEditOptions } from './ImageEditOptions';
import { ImageMetadataFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 * Horizontal direction types for image edit
 */
export type DNDDirectionX = 'w' | '' | 'e';

/**
 * @internal
 * Vertical direction types for image edit
 */
export type DnDDirectionY = 'n' | '' | 's';

/**
 * @internal
 * Context object of image editing for DragAndDropHelper
 */
export interface DragAndDropContext {
    /**
     * The CSS class name of this editing element
     */
    elementClass: ImageEditElementClass;

    /**
     * Edit info of current image, can be modified by handlers
     */
    editInfo: ImageMetadataFormat;

    /**
     * Horizontal direction
     */
    x: DNDDirectionX;

    /**
     * Vertical direction
     */
    y: DnDDirectionY;

    /**
     * Edit options
     */
    options: ImageEditOptions;
}
