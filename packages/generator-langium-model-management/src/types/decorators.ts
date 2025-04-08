import "reflect-metadata";

export function root(_target: any, _propertyKey?: any) {}
export function crossReference(_target: any, _propertyKey?: any) {}
export function path(_target: any, _propertyKey?: any) {}
export function defaultValue(value: any): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    // Store the default value in metadata
    Reflect.defineMetadata("defaultValue", value, target, propertyKey);
    // Optionally, add it to a custom decorators array for easier extraction
    const existing = target.__customDecorators || [];
    existing.push(`defaultValue:${value}`);
    target.__customDecorators = existing;
  };
}
