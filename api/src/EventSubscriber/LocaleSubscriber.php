<?php
// src/EventSubscriber/LocaleSubscriber.php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\HeaderUtils;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class LocaleSubscriber implements EventSubscriberInterface
{

    public function onKernelRequest(RequestEvent $event)
    {
        $request = $event->getRequest();
        $accept_language = $request->headers->get("accept-language");
        if (empty($accept_language)) {
            return;
        }
        $arr = HeaderUtils::split($accept_language, ',;');
        if (empty($arr[0][0])) {
            return;
        }

        // Symfony expects underscore instead of dash in locale
        $locale = str_replace('-', '_', $arr[0][0]);

        $request->setLocale($locale);
    }

    public static function getSubscribedEvents()
    {
        return [
            // must be registered before (i.e. with a higher priority than) the default Locale listener
            KernelEvents::REQUEST => [['onKernelRequest', 20]],
        ];
    }
}