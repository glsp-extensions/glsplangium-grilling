import { ModelManagementContribution } from "@borkdominik/model-management-common";
import { writePropertyPaletteHandlers } from "./generator";

export const PropertyPaletteContribution: ModelManagementContribution = {
  codeGeneration: ({ langiumDeclarations, glspRoot }) => {
    return writePropertyPaletteHandlers(glspRoot, langiumDeclarations);
  },
};
