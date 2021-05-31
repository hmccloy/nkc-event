<?php

return [
    'ctrl' => [
        'title' => 'LLL:EXT:nkc_event/Resources/Private/Language/locallang_db.xlf:tx_nkcevent_domain_model_filterdate',
        'label' => 'be_name',
        'tstamp' => 'tstamp',
        'crdate' => 'crdate',
        'cruser_id' => 'cruser_id',
        'dividers2tabs' => true,
        'searchFields' => 'be_name,name',
        'default_sortby' => 'ORDER BY date_from',
        'delete' => 'deleted',
        'enablecolumns' => [
            'disabled' => 'hidden',
            'starttime' => 'starttime',
            'endtime' => 'endtime',
        ],
        'iconfile' => 'EXT:nkc_event/Resources/Public/Icons/tx_nkcevent_domain_model_filterdate.svg'
    ],
    'interface' => [
        'showRecordFieldList' => 'sys_language_uid, l10n_parent, l10n_diffsource, hidden, name, date_from, date_to, be_name',
    ],
    'types' => [
        '1' => ['showitem' => 'hidden, name, date_from, date_to, be_name,--div--;LLL:EXT:core/Resources/Private/Language/locallang_ttc.xlf:tabs.access,starttime, endtime'],
    ],
    'palettes' => [
        '1' => ['showitem' => ''],
    ],
    'columns' => [
        'hidden' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_ttc.xlf:LGL.hidden',
            'config' => [
                'type' => 'check',
            ],
        ],
        'starttime' => [
            'exclude' => 1,
            'l10n_mode' => 'mergeIfNotBlank',
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_ttc.xlf:LGL.starttime',
            'config' => [
                'type' => 'input',
                'size' => 13,
                'max' => 20,
                'eval' => 'datetime',
                'checkbox' => 0,
                'default' => 0,
                'range' => [
                    'lower' => mktime(0, 0, 0, date('m'), date('d'), date('Y'))
                ],
            ],
        ],
        'endtime' => [
            'exclude' => 1,
            'l10n_mode' => 'mergeIfNotBlank',
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_ttc.xlf:LGL.endtime',
            'config' => [
                'type' => 'input',
                'size' => 13,
                'max' => 20,
                'eval' => 'datetime',
                'checkbox' => 0,
                'default' => 0,
                'range' => [
                    'lower' => mktime(0, 0, 0, date('m'), date('d'), date('Y'))
                ],
            ],
        ],
        'name' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:nkc_event/Resources/Private/Language/locallang_db.xml:tx_nkcevent_domain_model_filterdate.name',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'trim,required'
            ],
        ],
        'be_name' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:nkc_event/Resources/Private/Language/locallang_db.xml:tx_nkcevent_domain_model_filterdate.be_name',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'trim,required'
            ],
        ],
        'date_from' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:nkc_event/Resources/Private/Language/locallang_db.xml:tx_nkcevent_domain_model_filterdate.date_from',
            'config' => [
                'type' => 'input',
                'size' => 13,
                'max' => 20,
                'eval' => 'date',
                'checkbox' => 0,
                'default' => 0,
            ],
        ],
        'date_to' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:nkc_event/Resources/Private/Language/locallang_db.xml:tx_nkcevent_domain_model_filterdate.date_to',
            'config' => [
                'type' => 'input',
                'size' => 13,
                'max' => 20,
                'eval' => 'date',
                'checkbox' => 0,
                'default' => 0,
            ],
        ],
    ],
];
