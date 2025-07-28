import { LangiumDeclaration } from "./types";
export * from "./types";

export interface ModelManagementContribution {
  codeGeneration: (options: {
    langiumDeclarations: LangiumDeclaration[];
    glspRoot: string;
  }) => { path: string; content: string }[];
}
