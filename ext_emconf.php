<?php

/***************************************************************
 * Extension Manager/Repository config file for ext: "nkc_event"
 *
 * Auto generated by Extension Builder 2017-06-24
 *
 * Manual updates:
 * Only the data in the array - anything else is removed by next write.
 * "version" and "dependencies" must not be touched!
 ***************************************************************/

$EM_CONF[$_EXTKEY] = [
    'title' => 'Nordkirche Veranstaltungs Client',
    'description' => 'TYPO3 Extension zur Darstellung von Veranstaltungen aus der NAPI',
    'category' => 'plugin',
    'author' => 'netzleuchten GmbH',
    'author_email' => 'hallo@netzleuchten.com',
    'state' => 'stable',
    'internal' => '',
    'uploadfolder' => '0',
    'createDirs' => '',
    'clearCacheOnLoad' => 0,
    'version' => '10.4.0',
    'constraints' => [
        'depends' => [
            'typo3' => '10.4.0-10.4.99',
            'nkc_base' => '^10.4.0',
            'vhs' => '^6.0'
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
];
