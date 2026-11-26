export const runtime = "edge";

export default function PromoteSuccessPage() {
  return (
    <section className="page-head">
      <div className="container">
        <p className="page-eyebrow label-caps">Stripe Checkout complete</p>
        <h1 className="page-title">Placement received</h1>
        <p className="page-lead">Your payment was received. The placement will be checked before activation.</p>
      </div>
    </section>
  );
}
