export const PRIORITY = ['Normal', 'High']
export const ASSIGN = [

    "Accessioning",
    "Order entry",
    "Specimen storage",
    "Initial aliquoting",
    "Confirmation aliquoting",
    "Mass spec"]
export const CATEGORY = [
    {
        CATEGORY: 'Batch Corrections', SUBCATEGORY: [
            'Sample reinjections',
            'Batch reinjections',
            'Batch reprocess',
            'Sample reprocess',
            'Others'
        ]
    },
    { CATEGORY: 'Batches Ready For Review', SUBCATEGORY: [] },
    {
        CATEGORY: 'FAC Corrections', SUBCATEGORY: [
            'Improper integration/peak selection',
            'Control/sample/batch failed acceptance criteria',
            'Incomplete chain of custody',
            'Sequencing issue',
            'Report template error',
            'Unfilled integration tracker/communication sheet',
            'Missing data',
            'Calibrator issues',
            'Others – or (No correction was done)'
        ]
    },
    {
        CATEGORY: 'Announcement', SUBCATEGORY: [
            'Helpline',
            'Interdepartmental Info',
            'Others'
        ]
    }
]

export const pagination = {
    FIRST_PAGE: 'FIRST_PAGE',
    LAST_PAGE: 'LAST_PAGE',
    PREVIOUS_PAGE: 'PREVIOUS_PAGE',
    NEXT_PAGE: 'NEXT_PAGE'
}