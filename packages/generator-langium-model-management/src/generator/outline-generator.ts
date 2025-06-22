// outline-generator.ts
import fs from "fs";
import path from "path";
import { LangiumDeclaration } from "../types";

export function writeRequestOutlineActionHandler(
  extensionPath: string,
  declarations: LangiumDeclaration[]
): void {
  // ─── only concrete classes that extend Entity ──────────────────────────────────
  const nodes = getNodeDecls(declarations);

  // ─── prepare output dir ───────────────────────────────────────────────────────
  const outDir = path.join(extensionPath, "yo-generated", "outline");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const filePath = path.join(outDir, "request-outline-action-handler.ts");

  // ─── import all the isX guards for each Entity subtype ────────────────────────
  const guardNames = nodes.map((d) => `is${d.name}`).join(", ");
  const astImport = `import { ${guardNames} } from '../../../language-server/generated/ast.js';`;

  // ─── generate one if( isX(entity) ) block per Entity subtype ─────────────────
  const cases = nodes
    .map((d) => {
      const className = d.name!;
      const guard = `is${className}`;
      const parentIcon = className.toLowerCase();
      const lines: string[] = [];

      lines.push(`      if (${guard}(entity)) {`);
      lines.push(`        node.iconClass = '${parentIcon}';`);

      // for each array-multiplicity prop, map its children
      (d.properties ?? [])
        .filter((p) => p.multiplicity === "*")
        .forEach((p) => {
          const propName = p.name;
          const typeName = p.types[0].typeName!;
          const childIcon = typeName.toLowerCase();
          lines.push(
            `        node.children.push(\n` +
              `          ...(entity.${propName} ?? []).map(child => ({\n` +
              `            label: child.name,\n` +
              `            semanticUri: child.__id,\n` +
              `            children: [],\n` +
              `            iconClass: '${childIcon}'\n` +
              `          }))\n` +
              `        );`
          );
        });

      lines.push(`      }`);
      return lines.join("\n");
    })
    .join("\n\n");

  // ─── assemble the single handler file ─────────────────────────────────────────
  const content = `// AUTO-GENERATED – DO NOT EDIT
import { RequestOutlineAction, SetOutlineAction } from '@biguml/biguml-protocol';
import { ActionHandler, MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
${astImport}
import { ClassDiagramModelState } from '../../../glsp-server/class-diagram/model/class-diagram-model-state.js';

@injectable()
export class RequestOutlineActionHandler implements ActionHandler {
  actionKinds = [RequestOutlineAction.KIND];

  @inject(ClassDiagramModelState)
  protected modelState!: ClassDiagramModelState;

  execute(action: RequestOutlineAction): MaybePromise<any[]> {
    if (this.modelState.index.root.diagram.diagramType !== 'CLASS') {
      return [ SetOutlineAction.create({ outlineTreeNodes: [] }) ];
    }
    const root = this.modelState.index.root.diagram;
    const outlineTreeNodes = [
      { label: 'Model', semanticUri: root.__id, children: [], iconClass: 'model', isRoot: true }
    ];
    const entities = root.entities ?? [];
    entities.forEach(entity => {
      // default node (leaf)
      const node: any = {
        label: entity.name,
        semanticUri: entity.__id,
        children: [],
        iconClass: 'element'
      };

${cases}

      outlineTreeNodes[0].children.push(node);
    });
    return [ SetOutlineAction.create({ outlineTreeNodes }) ];
  }
}
`;

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Generated RequestOutlineActionHandler → ${filePath}`);
}

/**
 * Return only concrete classes (type==='class' && !isAbstract)
 * that (transitively) extend `Entity`.
 */
function getNodeDecls(decls: LangiumDeclaration[]): LangiumDeclaration[] {
  // build a name→declaration map for inheritance lookups
  const declMap = new Map(decls.map((d) => [d.name, d]));

  function inheritsFromEntity(name: string): boolean {
    const d = declMap.get(name);
    if (!d || !d.extends) return false;
    if (d.extends.includes("Entity")) return true;
    // recursively check parents
    return d.extends.some((parent) => inheritsFromEntity(parent));
  }

  return decls.filter(
    (d) =>
      d.type === "class" &&
      !d.isAbstract &&
      d.name !== "Entity" &&
      inheritsFromEntity(d.name!) // only those under Entity
  );
}
