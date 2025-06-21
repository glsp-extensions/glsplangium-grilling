import fs from "fs";
import path from "path";
import { Project } from "ts-morph";

interface PropertyInfo {
  name: string;
  decoratorTexts: string[];
  isArray: boolean;
}

interface EntityInfo {
  name: string; // Class, Enumeration, …
  dtoClassName: string; // ClassValidationElement
  props: PropertyInfo[];
}

interface ValidationInfo {
  entities: EntityInfo[];
  decoratorImports: Array<{ from: string; names: string[] }>;
}

function collectDecoratorImports(defPath: string) {
  const proj = new Project({
    tsConfigFilePath: path.join(process.cwd(), "tsconfig.json"),
  });
  const src = proj.addSourceFileAtPath(defPath);

  const res: ValidationInfo["decoratorImports"] = [];

  src.getImportDeclarations().forEach((imp) => {
    const mod = imp.getModuleSpecifierValue();
    if (
      mod === "class-validator" ||
      mod.includes("/validation/custom-validators")
    ) {
      const names = imp.getNamedImports().map((n) => n.getName());
      if (names.length) res.push({ from: mod, names });
    }
  });

  return res;
}

function buildValidationInfo(defPath: string): ValidationInfo {
  const decoratorImports = collectDecoratorImports(defPath);
  const decoratorNames = new Set<string>(
    decoratorImports.flatMap((i) => i.names)
  );

  const proj = new Project({
    tsConfigFilePath: path.join(process.cwd(), "tsconfig.json"),
  });
  const src = proj.addSourceFileAtPath(defPath);

  const entities: EntityInfo[] = [];

  src.getClasses().forEach((cls) => {
    const props: PropertyInfo[] = [];
    const validateIfRefs = new Set<string>();

    cls.getProperties().forEach((prop) => {
      const decos = prop
        .getDecorators()
        .filter((d) => decoratorNames.has(d.getName()));
      if (decos.length) {
        props.push({
          name: prop.getName(),
          decoratorTexts: decos.map((d) => d.getText()),
          isArray: prop.getType().isArray(),
        });

        // capture o.someFlag from @ValidateIf
        decos
          .filter((d) => d.getName() === "ValidateIf")
          .forEach((d) => {
            const lamb = d.getArguments()[0]?.getText() ?? "";
            Array.from(lamb.matchAll(/o\.(\w+)/g)).forEach((m) =>
              validateIfRefs.add(m[1])
            );
          });
      }
    });

    // bring referenced flags in even without decorators
    validateIfRefs.forEach((n) => {
      if (!props.find((p) => p.name === n)) {
        const pDecl = cls.getProperty(n);
        props.push({
          name: n,
          decoratorTexts: [],
          isArray: pDecl?.getType().isArray() ?? false,
        });
      }
    });

    if (props.length) {
      entities.push({
        name: cls.getName()!,
        dtoClassName: `${cls.getName()}ValidationElement`,
        props,
      });
    }
  });

  return { entities, decoratorImports };
}

export function writeValidationElementsFile(
  extPath: string,
  defPath: string,
  info: ValidationInfo
) {
  const out = path.join(
    extPath,
    "yo-generated",
    "validation",
    "validation-elements.ts"
  );
  fs.mkdirSync(path.dirname(out), { recursive: true });

  const imports: string[] = [];

  info.decoratorImports.forEach((i) => {
    const importPath = i.from.startsWith(".")
      ? path
          .relative(
            path.dirname(out),
            path.resolve(path.dirname(defPath), i.from)
          )
          .replace(/\\/g, "/")
      : i.from;
    imports.push(`import { ${i.names.join(", ")} } from '${importPath}';`);
  });

  const astImportPath = path
    .relative(path.dirname(out), path.join(extPath, "generated", "ast.js"))
    .replace(/\\/g, "/");

  imports.push(
    `import { ${info.entities.map((e) => e.name).join(", ")} } from '${astImportPath}';`
  );

  const classes = info.entities
    .map((ent) => {
      const body = ent.props
        .map((p) => {
          const decos = p.decoratorTexts.length
            ? "    " + p.decoratorTexts.join("\n    ") + "\n"
            : "";
          const type = p.isArray ? "unknown[]" : "any";
          return `${decos}    ${p.name}${p.isArray ? "?" : ""}: ${type};`;
        })
        .join("\n\n");

      return `
export class ${ent.dtoClassName} {
    constructor(src: ${ent.name}) { Object.assign(this, src); }

${body}
}
`;
    })
    .join("\n");

  fs.writeFileSync(out, `${imports.join("\n")}\n\n${classes}`, "utf8");
  console.log("Generated validation-elements file:", out);
}

function writeValidatorFile(extPath: string, info: ValidationInfo) {
  const out = path.join(extPath, "yo-generated", "validation/validator.ts");
  fs.mkdirSync(path.dirname(out), { recursive: true });

  const astGuards = info.entities.map((e) => `is${e.name}`).join(", ");
  const dtoNames = info.entities.map((e) => e.dtoClassName).join(", ");

  const cases = info.entities
    .map(
      (e) => `
    if (is${e.name}(node)) {
        errors = validateSync(new ${e.dtoClassName}(node));
    }`
    )
    .join("");

  const content = `import { validateSync } from 'class-validator';
import type { AstNode } from 'langium';
import { ${astGuards} } from '../../generated/ast.js';
import { ${dtoNames} } from './validation-elements.js';

export function validateNode(node: AstNode): void {
    let errors = [];${cases}

    if (errors.length) {
        const msg = errors.flatMap(e => Object.values(e.constraints ?? {})).join(', ');
        throw new Error('Validation error: ' + msg);
    }
}
`;
  fs.writeFileSync(out, content, "utf8");
  console.log("Generated validator file:", out);
}

export function generateValidationFiles(extensionPath: string) {
  const defPath = path.resolve(extensionPath, "definition", "def.ts");
  const info = buildValidationInfo(defPath);
  writeValidationElementsFile(extensionPath, defPath, info);
  writeValidatorFile(extensionPath, info);
}
