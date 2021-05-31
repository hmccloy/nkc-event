<?php

namespace  Nordkirche\NkcEvent\ViewHelpers;

use Nordkirche\Ndk\Domain\Repository\EventRepository;

class FindEventsViewHelper extends \TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper
{

    /**
     * @var bool
     */
    protected $escapeOutput = false;

    /**
     * Initialize arguments.
     *
     * @throws \TYPO3Fluid\Fluid\Core\ViewHelper\Exception
     */
    public function initializeArguments()
    {
        parent::initializeArguments();
        $this->registerArgument('institution', 'int', 'Find events by institution id');
        $this->registerArgument('location', 'int', 'Find events by location id');
        $this->registerArgument('search', 'int', 'Find events by fulltext query');
    }

    /**
     * @return string
     * @throws \Nordkirche\NkcBase\Exception\ApiException
     */
    public function render()
    {
        $api = \Nordkirche\NkcBase\Service\ApiService::get();
        $eventRepository = $api->factory(EventRepository::class);
        $query = new \Nordkirche\Ndk\Domain\Query\EventQuery();

        if ($this->arguments['institution']) {
            $query->setOrganizers([$this->arguments['institution']]);
        }

        if ($this->arguments['location']) {
            $query->setLocation($this->arguments['location']);
        }

        if ($this->arguments['search']) {
            $query->setQuery($this->arguments['search']);
        }

        $events = $eventRepository->get($query);

        if ($events->count()) {
            $this->templateVariableContainer->add('events', $events);

            $output =  $this->renderChildren();

            $this->templateVariableContainer->remove('events');

            return $output;
        }
    }
}
