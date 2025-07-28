import {
  LangiumDeclaration,
  ModelManagementContribution,
} from "@borkdominik/model-management-common";
import fs from "fs";
import path from "path";
import { format } from "../util";

export class GeneratorRegistry {
  private contributions: ModelManagementContribution[] = [];

  register(contribution: ModelManagementContribution): void {
    this.contributions.push(contribution);
  }

  async execute(
    glspRoot: string,
    langiumDeclarations: LangiumDeclaration[]
  ): Promise<void> {
    for (const contribution of this.contributions) {
      const results = contribution.codeGeneration({
        langiumDeclarations,
        glspRoot,
      });
      for (const { path: filePath, content } of results) {
        const formatted = await format(content);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, formatted, "utf8");
        console.log(`Generated: ${filePath}`);
      }
    }
  }
}
