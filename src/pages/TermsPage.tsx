import React from 'react';
import ContentPage from './ContentPage';
import { CARE_PLAN_PRICE_LABEL, PREVIEW_TTL_DAYS, SPRINT_PRICE_LABEL, SPRINT_REVISION_ROUNDS } from '../../shared/concept';
import { CONTACT_EMAIL } from '../lib/site';

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Service"
      metaTitle="Terms of Service | Zyvibe"
      intro="These terms cover the free landing page concept, the Website Sprint, and the optional Care Plan. Last updated October 11, 2026."
    >
      <section>
        <h2>Free concept</h2>
        <p>When you submit the intake form, Zyvibe generates an AI-assisted landing page concept from your answers and emails you a private preview link. The concept is a draft that shows a possible direction, structure, and message. It is not the final production website. Preview links stay active for {PREVIEW_TTL_DAYS} days.</p>
      </section>

      <section>
        <h2>Website Sprint — {SPRINT_PRICE_LABEL}, one-time</h2>
        <ul>
          <li>The Website Sprint is a single, one-time payment of {SPRINT_PRICE_LABEL}. It is never a subscription.</li>
          <li>Scope: design and build of your website, starting from your concept, and launch on your domain.</li>
          <li>Timeline: a 2-week sprint that starts at kickoff, after payment and once we have the content and access we need from you.</li>
          <li>Revisions: {SPRINT_REVISION_ROUNDS} revision rounds during the sprint. Changes beyond that are not included.</li>
        </ul>
      </section>

      <section>
        <h2>Refunds</h2>
        <p>You get a full refund if you ask before kickoff. Once the sprint has started, the payment is non-refundable. To request a refund, email {CONTACT_EMAIL}.</p>
      </section>

      <section>
        <h2>Care Plan — {CARE_PLAN_PRICE_LABEL}, optional</h2>
        <ul>
          <li>The Care Plan is offered only after your site launches. Nobody is enrolled automatically.</li>
          <li>It is a separate monthly subscription with a defined scope agreed at launch. It does not include unlimited changes or support.</li>
          <li>You can cancel at any time by emailing {CONTACT_EMAIL}; cancellation takes effect at the end of the current billing month.</li>
        </ul>
      </section>

      <section>
        <h2>No guarantees of results</h2>
        <p>We build clear, well-structured websites. We do not promise search rankings, traffic, leads, or revenue.</p>
      </section>

      <section>
        <h2>Payments</h2>
        <p>Payments are processed by Stripe. Zyvibe never sees or stores your full card or bank details.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-300 underline">{CONTACT_EMAIL}</a>.</p>
      </section>
    </ContentPage>
  );
}
