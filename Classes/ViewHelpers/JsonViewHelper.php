<?php
namespace  Nordkirche\NkcEvent\ViewHelpers;

use Nordkirche\Ndk\Domain\Model\Event\Event;
use TYPO3\CMS\Extbase\Utility\DebuggerUtility;

class JsonViewHelper extends \TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper
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
        $this->registerArgument('event', 'object', 'Event object', FALSE);
    }

    /**
     * @return string
     */
    public function render()
    {
        /** @var Event $event */
        $event = $this->arguments['event'];

        if ($event === null) {
            $event = $this->renderChildren();
        }

        if ($event instanceof Event) {

            $result = [
                '@context'  => 'https://schema.org',
                '@type'     => 'Event',
                  'location' => [
                        '@type' => 'Place',
                        'name'  => $event->getLocationName(),
                        'address' => [
                            '@type' => 'PostalAddress',
                            'addressLocality' => $event->getAddress()->getCity(),
                            'postalCode' => $event->getAddress()->getZipCode(),
                            'streetAddress' => $event->getAddress()->getStreet()
                        ]
                    ],
                'name' => $event->getTitle(),
                'description' => $event->getDescription(),
                'startDate' => $event->getStartsAt()->format("Y-m-d\TH:i")
            ];

            $price = $event->getPrice();

            if (isset($price['range']['from'])) {

                $result['offers'] = [
                    '@type' => 'Offer',
                    'price' => $price['range']['from'],
                    'priceCurrency' => 'EUR'
                ];

                if ($event->getRegistrationLink() != '') {
                    $result['offers']['url'] = $event->getRegistrationLink();
                }
            }

            return json_encode($result);
        } else {
            return json_encode([]);
        }
    }

}