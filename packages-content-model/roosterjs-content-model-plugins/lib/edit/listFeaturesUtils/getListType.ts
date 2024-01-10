import getNumberingListStyle from './getNumberingListStyle';
import { getIndex } from './getIndex';
import type { IStandaloneEditor } from 'roosterjs-content-model-types/lib/editor/IStandaloneEditor';
import {
    BulletListType,
    isBlockGroupOfType,
    updateListMetadata,
} from 'roosterjs-content-model-core';
import type {
    ContentModelDocument,
    ContentModelListItem,
    ContentModelParagraph,
} from 'roosterjs-content-model-types/lib';
import {
    getOperationalBlocks,
    getSelectedSegmentsAndParagraphs,
} from 'roosterjs-content-model-core/lib/publicApi/selection/collectSelections';

export function getListStyleType(
    editor: IStandaloneEditor
): { listType: 'UL' | 'OL'; styleType: number; index?: number } | undefined {
    const model = editor.createContentModel();
    const selectedSegmentsAndParagraphs = getSelectedSegmentsAndParagraphs(model, true);
    const marker = selectedSegmentsAndParagraphs[0][0];
    const paragraph = selectedSegmentsAndParagraphs[0][1];
    const listMarkerSegment = paragraph?.segments[0];
    if (
        marker &&
        marker.segmentType == 'SelectionMarker' &&
        listMarkerSegment &&
        listMarkerSegment.segmentType == 'Text'
    ) {
        const listMarker = listMarkerSegment.text;
        const bulletType = bulletListType[listMarker];

        if (bulletType) {
            return { listType: 'UL', styleType: bulletType };
        } else {
            const previousList = getPreviousListLevel(model, paragraph);
            const previousListStyle = getPreviousListStyle(previousList);
            const numberingType = getNumberingListStyle(
                listMarker,
                previousList?.format?.listStyleType,
                previousListStyle
            );
            if (numberingType) {
                return {
                    listType: 'OL',
                    styleType: numberingType,
                    index: previousList ? getIndex(listMarker) : undefined,
                };
            }
        }
    }
    return undefined;
}

const getPreviousListLevel = (model: ContentModelDocument, paragraph: ContentModelParagraph) => {
    const blocks = getOperationalBlocks(model, ['ListItem'], ['TableCell']);
    let listItem: ContentModelListItem | undefined = undefined;
    const listBlock = blocks.filter(({ block, parent }) => {
        return parent.blocks.indexOf(paragraph) > -1;
    })[0];
    if (listBlock) {
        const length = listBlock.parent.blocks.length;
        for (let i = length - 1; i > -1; i--) {
            const item = listBlock.parent.blocks[i];
            if (isBlockGroupOfType<ContentModelListItem>(item, 'ListItem')) {
                listItem = item;
                break;
            }
        }
    }
    return listItem;
};

const getPreviousListStyle = (list?: ContentModelListItem) => {
    if (list?.levels[0].dataset) {
        return updateListMetadata(list.levels[0])?.orderedStyleType;
    }
};

const bulletListType: Record<string, number> = {
    '*': BulletListType.Disc,
    '-': BulletListType.Dash,
    '--': BulletListType.Square,
    '->': BulletListType.LongArrow,
    '-->': BulletListType.DoubleLongArrow,
    '=>': BulletListType.UnfilledArrow,
    '>': BulletListType.ShortArrow,
    '—': BulletListType.Hyphen,
};
