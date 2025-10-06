import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Github, Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Project } from "contentlayer/generated";
/* import { GitHubIcon } from "@/components/icons/icons"; */
import { ZoomableImage } from "@/components/ui/zoomable-image";

type ProjectCardProps = Pick<
  Project,
  | "slug"
  | "image"
  | "title"
  | "summary"
  | "publishedAt"
  | "githubUrl"
  | "projectUrl"
  | "tags"
>;

export const ProjectCard = ({ project }: { project: ProjectCardProps }) => {
  return (
    <Card className="group overflow-hidden transition-all duration-500 hover:shadow-xl dark:hover:shadow-muted/30 h-full flex flex-col">
      <div className=" relative cursor-pointer">
        <ZoomableImage
          src={project.image}
          alt={`Screenshot of ${project.title}`}
          width={0}
          height={0}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
          {project.title}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed mt-2">
          {project.summary}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4 pt-0 flex-1">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-medium"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-6">
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Github className="h-4 w-4" />
              Code
            </a>
          </Button>
          {project.projectUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Demo
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
      <CardFooter className="-mt-2 w-full flex justify-end">
        <a href={`/projects/${project.slug}`}>
          <div className="flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all duration-200">
            <span>More information</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </a>
      </CardFooter>
    </Card>
  );
};
