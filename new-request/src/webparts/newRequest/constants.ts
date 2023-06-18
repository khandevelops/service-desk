export const PRIORITY = ['HIGH', 'NORMAL']
export const ASSIGN_TO = [
    "ACCESSIONING",
    "ORDER ENTRY",
    "SPECIMEN STORAGE",
    "INITIAL ALIQUOTING",
    "CONFIRMATION ALIQUOTING",
    "MASS SPEC"]
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