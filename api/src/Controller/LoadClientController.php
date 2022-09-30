<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LoadClientController extends \Symfony\Bundle\FrameworkBundle\Controller\AbstractController
{
    private $locales = ['en', 'nl'];
    private $defaultLocale = 'en';

    function load($path="")
    {
        // If no locale part redirect for default locale
        $slashPos = strpos($path, '/');
        if (false===$slashPos) {
            $locale = $this->defaultLocale;
            return $this->redirect($this->generateUrl('load_client', ['path'=>"$locale/$path"]));
        }

        // if first part is not a supported locale, redirect for default locale
        $locale = substr($path, 0, $slashPos);
        if (!in_array($locale, $this->locales)) {
            $locale = $this->defaultLocale;
            return $this->redirect($this->generateUrl('load_client', ['path'=>"$locale/". substr($path, $slashPos + 1)]));
        }

        // Return client content according to locale
        $content = file_get_contents("./angular/$locale/index.html");
        return new Response($content);
    }

}
