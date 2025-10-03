import { defineDocumentType, makeSource } from "contentlayer2/source-files";

const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    summary: { type: "string", required: true },
    image: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, required: true },
    projectUrl: { type: "string", required: false },
    githubUrl: { type: "string", required: false },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/projects/${doc._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "projects",
  documentTypes: [Project],
});
