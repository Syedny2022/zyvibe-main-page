import React, { useEffect } from 'react';
import ContentPage from './ContentPage';
import { SPRINT_REVISION_ROUNDS } from '../../shared/concept';
import { CONTACT_EMAIL, track } from '../lib/site';

export default function ThanksPage() {
  useEffect(() => {
    track('sprint_payment_success_page', { page: 'thanks' });
  }, []);

  return (
    <ContentPage
      title="Payment received. Your Website Sprint is confirmed."
      metaTitle="Payment Received | Zyvibe"
      noindex
      intro="Thank you. Stripe has emailed your receipt. Here is what happens next."
    >
      <section>
        <h2>Next steps</h2>
        <ul>
          <li>We email you a kickoff note from Zyvibe with the content and access we need from you.</li>
          <li>Your 2-week sprint starts at kickoff, once we have what we need.</li>
          <li>You get {SPRINT_REVISION_ROUNDS} revision rounds during the sprint, then we launch on your domain.</li>
        </ul>
      </section>
      <section>
        <h2>Questions</h2>
        <p>Email <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-300 underline">{CONTACT_EMAIL}</a>. Changed your mind? You get a full refund if you ask before kickoff.</p>
      </section>
    </ContentPage>
  );
}
