<?php

defined('TYPO3_MODE') || die('Access denied.');

call_user_func(
    function () {
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'Nordkirche.NkcEvent',
            'Main',
            'Veranstaltungen'
        );

        $pluginSignature = 'nkcevent_main';
        $GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist'][$pluginSignature] = 'pi_flexform';
        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPiFlexFormValue($pluginSignature, 'FILE:EXT:nkc_event/Configuration/FlexForms/flexform_main.xml');

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'Nordkirche.NkcEvent',
            'Map',
            'Karte mit Veranstaltungen darstellen'
        );

        $pluginSignature = 'nkcevent_map';
        $GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist'][$pluginSignature] = 'pi_flexform';
        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPiFlexFormValue($pluginSignature, 'FILE:EXT:nkc_event/Configuration/FlexForms/flexform_map.xml');

        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile('nkc_event', 'Configuration/TypoScript', 'Event Calendar');
    }
);
