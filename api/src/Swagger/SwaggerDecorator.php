<?php

namespace App\Swagger;

use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

final class SwaggerDecorator implements NormalizerInterface
{
    private $decorated;

    public function __construct(NormalizerInterface $decorated)
    {
        $this->decorated = $decorated;
    }

    public function normalize($object, string $format = null, array $context = [])
    {
        $summary = 'totals per day per Employee';
        $docs = $this->decorated->normalize($object, $format, $context);
        $docs['paths']['/hours/dayreport']['get']['summary'] = "Reports $summary";
        $docs['paths']['/hours/dayreport']['get']['description'] = 'Days start at time of start[after] filter';
        $docs['paths']['/hours/dayreport']['get']['responses']['200']['description'] = 'DayTotalsPerEmployee collection response';

        $responseContent = $docs['paths']['/hours/dayreport']['get']['responses']['200']['content'];
        $this->setByRef($docs, $responseContent['application/ld+json']['schema']['properties']['hydra:member']['items']['$ref'],
            'description', ucfirst($summary));
        $this->setByRef($docs, $responseContent['application/json']['schema']['items']['$ref'],
            'description', ucfirst($summary));

        return $docs;
    }

    public function supportsNormalization($data, string $format = null)
    {
        return $this->decorated->supportsNormalization($data, $format);
    }

    private function setByRef(&$docs, $ref, $key, $value)
    {
        $pieces = explode('/', substr($ref, 2));
        $sub =& $docs;
        foreach ($pieces as $piece) {
            $sub =& $sub[$piece];
        }
        $sub[$key] = $value;
    }
}