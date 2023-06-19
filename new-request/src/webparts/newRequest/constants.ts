export const PRIORITY = ['NORMAL', 'HIGH']
export const ASSIGN = [
    'Assign to',
    "ACCESSIONING",
    "ORDER ENTRY",
    "SPECIMEN STORAGE",
    "INITIAL ALIQUOTING",
    "CONFIRMATION ALIQUOTING",
    "MASS SPEC"]
export const CATEGORY = [
    { CATEGORY: 'Select Category', SUBCATEGORY: [] },
    {
        CATEGORY: 'Batch Corrections', SUBCATEGORY: [
            'Select sub category',
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
            'Select sub category',
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
            'Select sub category',
            'Helpline',
            'Interdepartmental Info',
            'Others'
        ]
    }
]