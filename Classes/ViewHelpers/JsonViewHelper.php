<?php
namespace  Nordkirche\NkcEvent\ViewHelpers;

use Nordkirche\Ndk\Domain\Model\Event\Event;
use Nordkirche\Ndk\Domain\Model\File\Image;
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

            if ($event->getPicture() instanceof Image) {
                $image = $event->getPicture()->render(600);
            } else {
                $image = '';
            }

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
                'image' => $image,
                'startDate' => $event->getStartsAt()->format("Y-m-d\TH:i")
            ];

            $price = $event->getPrice();

            if (isset($price['range']['from']) || isset($price['range']['to'])) {

                $result['offers'] = [
                    '@type' => 'Offer',
                    'price' => (bool) $price['range']['from'] ? $price['range']['from'] : $price['range']['to'],
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