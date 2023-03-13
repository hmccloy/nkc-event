<?php

defined('TYPO3') || die('Access denied.');

call_user_func(
    function () {

        $GLOBALS['TYPO3_CONF_VARS']['FE']['cacheHash']['excludedParameters'][] = 'tx_nkcevent_map[page]';
        $GLOBALS['TYPO3_CONF_VARS']['FE']['cacheHash']['excludedParameters'][] = 'tx_nkcevent_main[page]';

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'NkcEvent',
            'Main',
            [
                \Nordkirche\NkcEvent\Controller\EventController::class => 'list, search, searchForm, show, export, data, paginatedData, redirect'
            ],
            // non-cacheable actions
            [
                \Nordkirche\NkcEvent\Controller\EventController::class => 'export, search, paginatedData, redirect'
            ]
        );

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'NkcEvent',
            'Map',
            [
                \Nordkirche\NkcEvent\Controller\MapController::class => 'show,list,data,paginatedData',
            ],
            // non-cacheable actions
            [
                \Nordkirche\NkcEvent\Controller\MapController::class => 'paginatedData'
            ]
        );

        // wizards
        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig(
            'mod {
            wizards.newContentElement.wizardItems.plugins {
                elements {
                   event_main {
                        iconIdentifier = content-image
                        title = LLL:EXT:nkc_event/Resources/Private/Language/locallang_db.xlf:tx_nkc_event_domain_model_main
                        description = LLL:EXT:nkc_event/Resources/Private/Language/locallang_db.xlf:tx_nkc_event_domain_model_main.description
                        tt_content_defValues {
                            CType = list
                            list_type = nkcevent_main
                        }
                    }
                    event_map {
                        iconIdentifier = content-image
                        title = LLL:EXT:nkc_event/Resources/Private/Language/locallang_db.xlf:tx_nkc_event_domain_model_map
                        description = LLL:EXT:nkc_event/Resources/Private/Language/locallang_db.xlf:tx_nkc_event_domain_model_map.description
                        tt_content_defValues {
                            CType = list
                            list_type = nkcevent_map
                        }
                    }
                    
                }
                show = *
            }
       }'
        );

        // Page module hook
        $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['cms/layout/class.tx_cms_layout.php']['tt_content_drawItem']['nkc_event'] =
        \Nordkirche\NkcEvent\Hook\CmsLayout::class;
    }
);
