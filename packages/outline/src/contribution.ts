import { ModelManagementContribution } from "@borkdominik/model-management-common";
import { writeRequestOutlineActionHandlers } from "./generator";

export const OutlineContribution: ModelManagementContribution = {
  codeGeneration: ({ langiumDeclarations, glspRoot }) => {
    return writeRequestOutlineActionHandlers(glspRoot, langiumDeclarations);
  },
};
