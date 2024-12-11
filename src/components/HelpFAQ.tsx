import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function HelpFAQ() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Help & FAQ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What browser do I need to use this translator?
            </AccordionTrigger>
            <AccordionContent>
              This translator only works with Google Chrome, specifically the
              Chrome Canary version, which includes the new built-in AI Prompt
              API.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I set up Chrome Canary?</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Download and install Chrome Canary from the official Google
                  website.
                </li>
                <li>
                  Ensure you're using Chrome Canary version 131 or greater.
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              What feature flags need to be enabled?
            </AccordionTrigger>
            <AccordionContent>
              <p>You need to enable the following flags in Chrome Canary:</p>
              <ol className="list-decimal list-inside space-y-2 mt-2">
                <li>Open chrome://flags in Chrome Canary</li>
                <li>Enable "#translation-api"</li>
                <li>Enable "#prompt-api-for-gemini-nano"</li>
                <li>
                  Enable "#optimization-guide-on-device-model" and set it to
                  "Enabled BypassPrefRequirement"
                </li>
                <li>Restart Chrome Canary</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              How do I download the required model?
            </AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal list-inside space-y-2">
                <li>Open chrome://components/ in Chrome Canary</li>
                <li>Find "Optimization Guide On Device Model"</li>
                <li>Click "Check for update" to download the model</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              Why am I seeing an error or the translator isn't working?
            </AccordionTrigger>
            <AccordionContent>
              If you're experiencing issues, please check the following:
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Ensure you're using the latest version of Chrome Canary</li>
                <li>Verify all required feature flags are enabled</li>
                <li>Make sure the on-device model is downloaded</li>
                <li>Restart Chrome Canary after making changes</li>
                <li>
                  If issues persist, try clearing your browser cache and cookies
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
