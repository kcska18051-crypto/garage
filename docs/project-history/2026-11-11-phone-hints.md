# Phone assistance in feedback forms — 11 November 2026

User requested a +7 example and an indication of the remaining digit count in all feedback forms. Added the shared PhoneHint component and placeholder +7 (___) ___-__-__, with «10 цифр после +7» beneath the field.

Covered ContactDialog (callback, message and consultation), ServiceRequestDialog (repair, paint and rental), and the credit inquiry in CartTools. Email-only replies hide the phone hint. Mixed consultation retains email input and explains the alternative. This is guidance, not an input mask or change to accepted phone-number validation. Authentication, profile identity and checkout are outside feedback-form scope.

Validation: build:pages, 12 existing service dialog tests and one new contact-mode integration test; browser inspection of service dialog at 1440/390 and callback placeholder. Helper IDs remain associated through aria-describedby together with validation errors.
