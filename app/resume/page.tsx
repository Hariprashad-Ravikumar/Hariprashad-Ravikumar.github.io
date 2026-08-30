import Link from "next/link";
import Container from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import ResumeSection from "@/components/content/ResumeSection";
import ResumeSideNav from "@/components/content/ResumeSideNav";
import {
  AWARDS,
  CERTIFICATIONS,
  CONTACT,
  COURSEWORK,
  EDUCATION,
  INDUSTRY_EXPERIENCE,
  RESEARCH_EXPERIENCE,
  SCHOOLS,
  TEACHING,
  TECHNICAL_SKILLS,
  WORKSHOPS,
} from "@/content/resume";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Résumé | Hariprashad Ravikumar",
  description:
    "Full curriculum vitae: Western Digital R&D, PhD in Physics at NMSU, publications, awards, and technical skills.",
  path: "/resume/",
  image: "/og/resume.png",
});

export default function ResumePage() {
  return (
    <Container>
      <div className="flex flex-col gap-8 py-10 md:py-14 lg:flex-row lg:gap-12">
        <ResumeSideNav />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-h1 text-[var(--ink-900)]">Résumé</h1>
            <LinkButton href="/cv/CV_HARI.pdf" variant="primary" target="_blank" rel="noopener noreferrer">
              Download PDF
            </LinkButton>
          </div>

          <div className="text-small mt-2 text-[var(--ink-500)]">
            <p>
              <a href={`mailto:${CONTACT.email}`} className="text-[var(--brand-500)] hover:underline">
                {CONTACT.email}
              </a>
            </p>
            {CONTACT.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <ResumeSection id="industry" title="Industry Experience">
            {INDUSTRY_EXPERIENCE.map((role) => (
              <div key={role.role}>
                <p className="text-h3 text-[var(--ink-900)]">{role.role}</p>
                <p className="text-small text-[var(--ink-500)]">
                  {role.org} · {role.dates}
                </p>
                <ul className="prose-measure mt-2 list-disc pl-5">
                  {role.bullets.map((bullet) => (
                    <li key={bullet} className="text-body mb-1 text-[var(--ink-700)]">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ResumeSection>

          <ResumeSection id="education" title="Education">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {EDUCATION.map((row) => (
                    <tr key={row.degree} className="border-t border-[var(--glass-border)] first:border-t-0">
                      <td className="py-2 pr-4 text-sm text-[var(--ink-500)]">{row.dates}</td>
                      <td className="py-2 pr-4 text-sm font-semibold text-[var(--ink-900)]">{row.degree}</td>
                      <td className="py-2 text-sm text-[var(--ink-700)]">{row.org}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3">
              <p className="text-h3 text-[var(--ink-900)]">Graduate-Level Coursework</p>
              <div className="overflow-x-auto">
                <table className="mt-2 w-full text-left">
                  <tbody>
                    {COURSEWORK.map((row) => (
                      <tr key={row.area} className="border-t border-[var(--glass-border)] first:border-t-0">
                        <td className="py-2 pr-4 align-top text-sm font-semibold text-[var(--ink-900)]">
                          {row.area}
                        </td>
                        <td className="py-2 text-sm text-[var(--ink-700)]">{row.items}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ResumeSection>

          <ResumeSection id="skills" title="Technical Skills">
            {TECHNICAL_SKILLS.map((group) => (
              <div key={group.group} className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
                <p className="w-44 shrink-0 text-sm font-semibold text-[var(--ink-900)]">{group.group}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </ResumeSection>

          <ResumeSection id="research" title="Research Experience">
            {RESEARCH_EXPERIENCE.map((role) => (
              <div key={role.role}>
                <p className="text-h3 text-[var(--ink-900)]">{role.role}</p>
                <p className="text-body prose-measure mt-1 text-[var(--ink-700)]">{role.desc}</p>
              </div>
            ))}
          </ResumeSection>

          <ResumeSection id="publications" title="Publications">
            <p className="text-body prose-measure text-[var(--ink-700)]">
              See the full list, including peer-reviewed work, manuscripts in preparation, and
              conference proceedings, on the{" "}
              <Link href="/publications/" className="text-[var(--brand-500)] hover:underline">
                Publications
              </Link>{" "}
              page.
            </p>
          </ResumeSection>

          <ResumeSection id="awards" title="Awards">
            <ul className="flex flex-col gap-3">
              {AWARDS.map((award) => (
                <li key={award.title}>
                  <p className="text-body font-semibold text-[var(--ink-900)]">{award.title}</p>
                  <p className="text-small text-[var(--ink-500)]">{award.org}</p>
                </li>
              ))}
            </ul>
          </ResumeSection>

          <ResumeSection id="certifications" title="Certifications">
            <ul className="flex flex-col gap-3">
              {CERTIFICATIONS.map((cert) => (
                <li key={cert.title}>
                  <p className="text-body font-semibold text-[var(--ink-900)]">{cert.title}</p>
                  <p className="text-small text-[var(--ink-500)]">
                    {cert.org} · {cert.issued}
                  </p>
                  {cert.credential && (
                    <a
                      href={cert.credential.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-small text-[var(--brand-500)] hover:underline"
                    >
                      {cert.credential.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </ResumeSection>

          <ResumeSection id="schools" title="Schools & Workshops">
            <div>
              <p className="text-h3 text-[var(--ink-900)]">Internships & Schools Attended</p>
              <ul className="mt-2 flex flex-col gap-3">
                {SCHOOLS.map((school) => (
                  <li key={school.title}>
                    <p className="text-body font-semibold text-[var(--ink-900)]">{school.title}</p>
                    <p className="text-small text-[var(--ink-500)]">{school.org}</p>
                    <p className="text-small text-[var(--ink-500)]">{school.dates}</p>
                    {school.note && <p className="text-small text-[var(--ink-500)]">{school.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-3">
              <p className="text-h3 text-[var(--ink-900)]">Workshops & Courses Attended</p>
              <ul className="mt-2 flex flex-col gap-3">
                {WORKSHOPS.map((workshop) => (
                  <li key={workshop.title}>
                    <p className="text-body font-semibold text-[var(--ink-900)]">{workshop.title}</p>
                    <p className="text-small text-[var(--ink-500)]">{workshop.org}</p>
                    <p className="text-small text-[var(--ink-500)]">{workshop.dates}</p>
                    {workshop.note && <p className="text-small text-[var(--ink-500)]">{workshop.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </ResumeSection>

          <ResumeSection id="teaching" title="Teaching">
            {TEACHING.map((role) => (
              <div key={role.role}>
                <p className="text-h3 text-[var(--ink-900)]">{role.role}</p>
                <p className="text-body prose-measure mt-1 text-[var(--ink-700)]">{role.desc}</p>
              </div>
            ))}
          </ResumeSection>
        </div>
      </div>
    </Container>
  );
}
