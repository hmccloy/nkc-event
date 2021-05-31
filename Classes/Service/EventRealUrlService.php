<?php

namespace Nordkirche\NkcEvent\Service;

use Nordkirche\Ndk\Domain\Repository\EventRepository;
use Nordkirche\NkcBase\Service\AbstractRealUrlService;

class EventRealUrlService extends AbstractRealUrlService
{
    public function __construct()
    {
        parent::__construct();
        $this->object = 'event';
        $this->repository = $this->api->factory(EventRepository::class);
    }

    protected function getItemLabel($item)
    {
        return $item->getTitle();
    }
}
