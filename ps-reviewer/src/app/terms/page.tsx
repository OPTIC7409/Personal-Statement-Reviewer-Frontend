'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function TermsPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Welcome to Personal Statement Reviewer</CardTitle>
                    <CardDescription>
                        Please read these terms carefully before using our service.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        By using the Personal Statement Reviewer service, you agree to abide by these terms and conditions. Our service is designed to help you improve your personal statement, not to write it for you or encourage any form of plagiarism.
                    </p>
                    <h2 className="text-2xl font-semibold mb-4">Proper Use of the Service</h2>
                    <p className="mb-4">
                        The Personal Statement Reviewer is a tool to enhance your writing and help you produce your best work. It is not a substitute for your own efforts and ideas. We strongly emphasize that:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>The content of your personal statement must be your own original work.</li>
                        <li>Our service is meant to provide feedback, suggestions, and improvements on your existing work.</li>
                        <li>The final personal statement should reflect your unique voice, experiences, and aspirations.</li>
                    </ul>
                    <p className="mb-4 font-semibold">
                        Any form of plagiarism or misrepresentation in your personal statement is strictly prohibited and may have serious consequences for your application process.
                    </p>
                </CardContent>
            </Card>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>1. Service Description</AccordionTrigger>
                    <AccordionContent>
                        <p>
                            Personal Statement Reviewer provides AI-powered feedback and suggestions to improve the quality, clarity, and effectiveness of your personal statement. Our service includes grammar checks, style recommendations, and content improvement suggestions.
                        </p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger>2. User Responsibilities</AccordionTrigger>
                    <AccordionContent>
                        <p>As a user of our service, you are responsible for:</p>
                        <ul className="list-disc pl-6 mt-2">
                            <li>Providing your own original content for review</li>
                            <li>Using the feedback to improve your work, not to copy or plagiarize</li>
                            <li>Ensuring the final submission is your own work</li>
                            <li>Complying with the rules and requirements of the institution or organization you're applying to</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger>3. Intellectual Property</AccordionTrigger>
                    <AccordionContent>
                        <p>
                            The content you submit remains your intellectual property. Our service provides feedback on your work but does not claim any ownership over your personal statement. The AI-generated feedback is provided as a service and should be used as a guide for improvement, not as content to be directly copied into your work.
                        </p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                    <AccordionTrigger>4. Prohibited Uses</AccordionTrigger>
                    <AccordionContent>
                        <p>The following uses of our service are strictly prohibited:</p>
                        <ul className="list-disc pl-6 mt-2">
                            <li>Submitting content that is not your own original work</li>
                            <li>Using the service to generate entire personal statements</li>
                            <li>Copying feedback verbatim into your personal statement</li>
                            <li>Sharing your account or the feedback you receive with others</li>
                            <li>Using the service to create misleading or false information</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                    <AccordionTrigger>5. Disclaimer of Warranties</AccordionTrigger>
                    <AccordionContent>
                        <p>
                            While we strive to provide accurate and helpful feedback, Personal Statement Reviewer is provided "as is" without any warranties. We do not guarantee admission or success in your application process. The effectiveness of our service depends on how you use the feedback to improve your own work.
                        </p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                    <AccordionTrigger>6. Limitation of Liability</AccordionTrigger>
                    <AccordionContent>
                        <p>
                            Personal Statement Reviewer shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our service.
                        </p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                    <AccordionTrigger>7. Termination</AccordionTrigger>
                    <AccordionContent>
                        <p>
                            We reserve the right to terminate or suspend your access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms of Service.
                        </p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                    <AccordionTrigger>8. Changes to Terms</AccordionTrigger>
                    <AccordionContent>
                        <p>
                            We reserve the right to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes. Your continued use of our service following the posting of any changes constitutes acceptance of those changes.
                        </p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Card className="mt-8">
                <CardContent className="pt-6">
                    <p className="text-center">
                        By using Personal Statement Reviewer, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. Remember, our goal is to help you improve your personal statement and showcase your best self. Use our service responsibly and ethically to create a personal statement that truly represents you.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}