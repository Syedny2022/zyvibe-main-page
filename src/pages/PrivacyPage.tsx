import React from 'react';
import ContentPage from './ContentPage';
import { PREVIEW_TTL_DAYS } from '../../shared/concept';
import { CONTACT_EMAIL } from '../lib/site';

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      metaTitle="Privacy Policy | Zyvibe"
      intro="What we collect on zyvibe.com, why, and who processes it. Last updated October 11, 2026."
    >
      <section>
        <h2>What we collect</h2>
        <ul>
          <li>Intake form answers: business name, your name, email, current website, what you offer, your audience, page goal, visual direction, and reference sites.</li>
          <li>Newsletter and partner-list sign-ups: your email address.</li>
          <li>Change requests you send from a concept preview.</li>
          <li>Basic analytics about how pages are used.</li>
        </ul>
      </section>

      <section>
        <h2>Why we use it</h2>
        <ul>
          <li>To generate your landing page concept and email you the private preview link.</li>
          <li>To reply to you, run your Website Sprint if you buy one, and send updates you asked for.</li>
          <li>To understand which pages help visitors, so we can improve the site.</li>
        </ul>
      </section>

      <section>
        <h2>Who processes it</h2>
        <ul>
          <li>Cloudflare — hosting, form handling, and storage of intake answers and concepts.</li>
          <li>OpenRouter — your intake answers are sent to an AI model through OpenRouter to write your concept.</li>
          <li>Resend — sends our emails.</li>
          <li>Stripe — processes payments. We never see your full card or bank details.</li>
          <li>Google Analytics, Google Tag Manager, and Cloudflare Web Analytics — site analytics.</li>
        </ul>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>Concept preview links stop working after {PREVIEW_TTL_DAYS} days. You can ask us to delete your intake answers, concept, or email address at any time.</p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>To access, correct, or delete your data, or to unsubscribe, email <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-300 underline">{CONTACT_EMAIL}</a>.</p>
      </section>
    </ContentPage>
  );
}
