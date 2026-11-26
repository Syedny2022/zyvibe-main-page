import Link from "next/link";

type Props = {
  index: string;
  title: string;
  note?: string;
  cta?: { label: string; href: string };
};

export function SectionHeader({ index, title, note, cta }: Props) {
  return (
    <div className="grid-12 section-header">
      <span className="section-header-index label-caps">{index}</span>
      <h2 className="section-header-title">{title}</h2>
      <div className="section-header-note">
        {note && <span className="label-caps">{note}</span>}
        {cta && (
          <Link className="section-header-cta mono" href={cta.href}>
            {cta.label} <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </div>
    </div>
  );
}
