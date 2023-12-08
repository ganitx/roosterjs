import hasSelectionInBlock from '../../publicApi/selection/hasSelectionInBlock';
import hasSelectionInBlockGroup from '../../publicApi/selection/hasSelectionInBlockGroup';
import { ContentModelBlock, DeleteSelectionContext } from 'roosterjs-content-model-types';
import { getClosestAncestorBlockGroupIndex } from '../../publicApi/model/getClosestAncestorBlockGroupIndex';

function isEmptyBlock(block: ContentModelBlock | undefined): boolean {
    if (block && block.blockType == 'Paragraph') {
        return block.segments.every(
            segment => segment.segmentType !== 'SelectionMarker' && segment.segmentType == 'Br'
        );
    }

    if (block && block.blockType == 'BlockGroup') {
        return block.blocks.every(isEmptyBlock);
    }

    return !!block;
}

//Verify if we need to remove the list item levels
//If the first item o the list is selected in a expanded selection, we need to remove the list item levels
export function deleteEmptyList(context: DeleteSelectionContext) {
    const { insertPoint, deleteResult } = context;
    if (deleteResult == 'range' && insertPoint?.path) {
        const index = getClosestAncestorBlockGroupIndex(insertPoint.path, ['ListItem']);
        const item = insertPoint.path[index];
        if (index >= 0 && item && item.blockGroupType == 'ListItem') {
            const listItemIndex = insertPoint.path[index + 1].blocks.indexOf(item);
            const previousBlock =
                listItemIndex > -1
                    ? insertPoint.path[index + 1].blocks[listItemIndex - 1]
                    : undefined;
            const nextBlock =
                listItemIndex > -1
                    ? insertPoint.path[index + 1].blocks[listItemIndex + 1]
                    : undefined;
            if (
                hasSelectionInBlockGroup(item) &&
                (!previousBlock || hasSelectionInBlock(previousBlock)) &&
                nextBlock &&
                isEmptyBlock(nextBlock)
            ) {
                item.levels = [];
            }
        }
    }
}
