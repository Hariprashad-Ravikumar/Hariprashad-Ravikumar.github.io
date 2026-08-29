import Tag from "@/components/ui/Tag";
import { TECHNICAL_SKILLS } from "@/content/cv";

export default function TechStack() {
  return (
    <section className="py-16">
      <h2 className="text-h2 text-[var(--ink-900)]">Tech stack</h2>
      <div className="mt-6 flex flex-col gap-4">
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
      </div>
    </section>
  );
}
