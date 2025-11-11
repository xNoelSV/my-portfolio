import { ExternalLink } from "lucide-react";
import { Certification } from "../../data/certifications";

export function CertificationItem({
  certification,
}: {
  certification: Certification;
}) {
  return (
    <article
      key={certification.title}
      className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 transition-all duration-500 hover:shadow-lg dark:hover:shadow-muted/30"
    >
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-medium mb-2">{certification.title}</h3>

        <p className="text-xs text-muted-foreground mb-4">
          {certification.issueDate} • {certification.issuer}
        </p>

        <div className="mt-auto flex justify-end">
          <a
            href={certification.credentialLink}
            target="_blank"
            rel="noopener noreferrer"
            // TODO: Improve hover effect on link
            className="flex items-center text-sm font-medium text-primary"
            aria-label={`View certificate: ${certification.title}`}
          >
            Visit
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
