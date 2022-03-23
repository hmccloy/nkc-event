<?php

namespace Nordkirche\NkcEvent\Hook;

/**
 * This file is part of the "nkc_event" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 */
use Nordkirche\Ndk\Api;
use Nordkirche\Ndk\Domain\Model\Event\Event;
use Nordkirche\Ndk\Domain\Repository\EventRepository;
use Nordkirche\Ndk\Service\NapiService;
use Nordkirche\NkcBase\Service\ApiService;
use Nordkirche\NkcEvent\Controller\EventController;
use Nordkirche\NkcEvent\Controller\MapController;
use TYPO3\CMS\Core\Localization\LanguageService;
use TYPO3\CMS\Core\Utility\GeneralUtility;

/**
 * Hook to display verbose information about the plugin
 */
class CmsLayout implements \TYPO3\CMS\Backend\View\PageLayoutViewDrawItemHookInterface
{
    const LLPATH = 'LLL:EXT:nkc_event/Resources/Private/Language/locallang.xlf:';
    const LLPATH_DB = 'LLL:EXT:nkc_event/Resources/Private/Language/locallang_db.xlf:';

    /**
     * @var Api
     */
    protected $api;

    /**
     * @var \TYPO3\CMS\Extbase\Object\ObjectManager
     */
    protected $objectManager;

    /**
     * @var array
     */
    protected $flexformData;

    /**
     * Preprocesses the preview rendering of a content element.
     *
     * @param \TYPO3\CMS\Backend\View\PageLayoutView $parentObject Calling parent object
     * @param bool $drawItem Whether to draw the item using the default functionalities
     * @param string $headerContent Header content
     * @param string $itemContent Item content
     * @param array $row Record row of tt_content
     * @throws \Nordkirche\NkcBase\Exception\ApiException
     * @throws \TYPO3\CMS\Extbase\Object\Exception
     */
    public function preProcess(\TYPO3\CMS\Backend\View\PageLayoutView &$parentObject, &$drawItem, &$headerContent, &$itemContent, array &$row)
    {
        if ($row['list_type'] == 'nkcevent_main') {
            $this->api = ApiService::get();

            $this->flexformData = \TYPO3\CMS\Core\Utility\GeneralUtility::xml2array($row['pi_flexform']);

            $drawItem = false;

            $headerContent = '<h3>Veranstaltung(en) darstellen</h3>';

            if (strpos($this->getFieldFromFlexform('switchableControllerActions', 'sDEF'), ';') !== false) {
                list($switchableControllerAction) = explode(';', $this->getFieldFromFlexform('switchableControllerActions', 'sDEF'));
            } else {
                $switchableControllerAction = $this->getFieldFromFlexform('switchableControllerActions', 'sDEF');
            }

            list($controller, $action) = explode('->', $switchableControllerAction);

            $content = '<p>Funktion: ' . ucfirst($action) . '</p>';

            $layoutKey = $this->getFieldFromFlexform('settings.flexform.searchFormTemplate', 'sTemplate');

            $content .= '<p>Layout: ' . ($layoutKey ? $layoutKey : 'Default') . '</p>';

            $this->objectManager = GeneralUtility::makeInstance(\TYPO3\CMS\Extbase\Object\ObjectManager::class);

            if ($action == 'show') {
                $content .= $this->renderEventSingleView();
            } elseif ($action == 'selection') {
                $content .= $this->renderEventSelectionView();
            } elseif ($action == 'searchForm') {
                $content .= '';
            } else {
                $content .= $this->renderEventListView();
            }

            $itemContent = $content;
        } elseif ($row['list_type'] == 'nkcevent_map') {
            $this->api = ApiService::get();

            $this->flexformData = \TYPO3\CMS\Core\Utility\GeneralUtility::xml2array($row['pi_flexform']);

            $this->objectManager = GeneralUtility::makeInstance(\TYPO3\CMS\Extbase\Object\ObjectManager::class);

            $drawItem = false;

            $headerContent = '<h3>Karte mit Veranstaltungen darstellen</h3>';

            $itemContent = $this->renderMapView();
        }
    }

    /**
     * @return string
     * @throws \TYPO3\CMS\Extbase\Object\Exception
     */
    private function renderMapView()
    {
        $content = '';

        $settings = [
            'asyncLoadingMaxItems' => 10,
            'flexform' => [
                'institutionCollection' => $this->getFieldFromFlexform('settings.flexform.institutionCollection', 'sMarker'),
                'eventCollection' => $this->getFieldFromFlexform('settings.flexform.eventCollection', 'sMarker'),
                'categories' => $this->getFieldFromFlexform('settings.flexform.categories', 'sMarker'),
                'selectCategoryOption' => $this->getFieldFromFlexform('settings.flexform.selectCategoryOption', 'sMarker'),
                'cities' => $this->getFieldFromFlexform('settings.flexform.cities', 'sMarker'),
                'zipCodes' => $this->getFieldFromFlexform('settings.flexform.zipCodes', 'sMarker'),
                'dateFrom' => $this->getFieldFromFlexform('settings.flexform.dateFrom', 'sMarker'),
                'dateTo' => $this->getFieldFromFlexform('settings.flexform.dateTo', 'sMarker'),
                'numDays' => $this->getFieldFromFlexform('settings.flexform.numDays', 'sMarker')
            ]
        ];

        $mapController = $this->objectManager->get(MapController::class);
        $mapController->initializeAction();

        $query = new \Nordkirche\Ndk\Domain\Query\EventQuery();

        list($limit, $mapItems) = $mapController->getMapItems($query, $settings);

        $content .= '<p>Marker:<br /><ul>';

        foreach ($mapItems as $record) {
            $content .= '<li>';
            $content .= htmlentities($record->getLabel());
            $content .= ' [' . intval($record->getId()) . ']';
            $content .= '</li>';
        }

        $content .= '</ul></p>';

        if ($limit) {
            $content .= '... und weitere ' . ($mapItems->getRecordCount() - 10);
        }

        return $content;
    }

    /**
     * @return string
     */
    private function renderEventSelectionView()
    {
        $content = '';

        $selection = GeneralUtility::trimExplode(',', $this->getFieldFromFlexform('settings.flexform.eventCollection', 'sDEF'));
        $napiService = $this->api->factory(NapiService::class);
        $events  = $napiService->resolveUrls($selection);

        if (count($events)) {
            $content .= '<p>Auswahl von Veranstaltungen:<br /><ul>';

            foreach ($events as $event) {
                $content .= '<li>';
                $content .= htmlentities($event->getLabel());
                $content .= ' [' . intval($event->getId()) . ']';
                $content .= '</li>';
            }

            $content .= '</ul></p>';
        } else {
            $content .= 'Keine Treffer!';
        }

        return $content;
    }

    /**
     * @return string
     * @throws \TYPO3\CMS\Extbase\Object\Exception
     */
    private function renderEventListView()
    {
        $content = '';

        $eventRepository = $this->api->factory(EventRepository::class);
        /** @var EventController $eventController */
        $eventController = $this->objectManager->get(EventController::class);
        $query = $this->api->factory(\Nordkirche\Ndk\Domain\Query\EventQuery::class);

        // Set pagination parameters
        $query->setPageSize(10);

        $flexform = [
            'eventTypes' => $this->getFieldFromFlexform('settings.flexform.eventTypes', 'sDEF'),
            'institutionCollection' => $this->getFieldFromFlexform('settings.flexform.institutionCollection', 'sDEF'),
            'categories' => $this->getFieldFromFlexform('settings.flexform.categories', 'sDEF'),
            'categoryOperator' => $this->getFieldFromFlexform('settings.flexform.categoryOperator', 'sDEF'),
            'geosearch' => $this->getFieldFromFlexform('settings.flexform.geosearch', 'sDEF'),
            'latitude' => $this->getFieldFromFlexform('settings.flexform.latitude', 'sDEF'),
            'longitude' => $this->getFieldFromFlexform('settings.flexform.longitude', 'sDEF'),
            'radius' => $this->getFieldFromFlexform('settings.flexform.radius', 'sDEF'),
            'dateFrom' => $this->getFieldFromFlexform('settings.flexform.dateFrom', 'sDEF'),
            'dateTo' => $this->getFieldFromFlexform('settings.flexform.dateTo', 'sDEF'),
            'numDays' => $this->getFieldFromFlexform('settings.flexform.numDays', 'sDEF'),
        ];

        $eventController->setFlexformFilters($query, $flexform);

        // Get institutions
        $events = $eventRepository->get($query);

        if ($events) {
            $content .= '<p>Liste von Veranstaltungen:<br /><ul>';

            foreach ($events as $event) {
                $content .= '<li>';
                $content .= htmlentities($event->getLabel());
                $content .= ' [' . intval($event->getId()) . ']';
                $content .= '</li>';
            }

            $content .= '</ul></p>';

            if ($events->getPageCount() > 1) {
                $content .= '... ' . $events->getRecordCount() . ' Veranstaltungen';
            }
        } else {
            $content .= 'Keine Treffer!';
        }

        return $content;
    }

    /**
     * @return string
     */
    private function renderEventSingleView()
    {
        $content = '';
        $eventResource = $this->getFieldFromFlexform('settings.flexform.singleInstitution', 'sDEF');
        if ($eventResource) {
            $content .= '<p>Zeige ausgewähltes Event: ';
            $napiService = $this->api->factory(NapiService::class);
            $event = $napiService->resolveUrl($eventResource);
            if ($event instanceof Event) {
                $content .= htmlentities($event->getTitle());
                $content .= ' [' . intval($event->getId()) . ']';
            } else {
                $content .= '[nicht gefunden]';
            }
            $content .= '</p>';
        } else {
            $content .= '<p>Zeige Event via URL Parameter</p>';
        }
        return $content;
    }

    /**
     * Get field value from flexform configuration,
     * including checks if flexform configuration is available
     *
     * @param string $key name of the key
     * @param string $sheet name of the sheet
     * @return string|null if nothing found, value if found
     */
    protected function getFieldFromFlexform($key, $sheet = 'sDEF')
    {
        $flexform = $this->flexformData;

        if (isset($flexform['data'])) {
            $flexform = $flexform['data'];
            if (is_array($flexform) && is_array($flexform[$sheet]) && is_array($flexform[$sheet]['lDEF'])
                && is_array($flexform[$sheet]['lDEF'][$key]) && isset($flexform[$sheet]['lDEF'][$key]['vDEF'])
            ) {
                return $flexform[$sheet]['lDEF'][$key]['vDEF'];
            }
        }

        return null;
    }

}
