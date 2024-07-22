import chalk from "chalk";

export function checkGeneratorConfigValidity(config: any) {
  if (typeof config.referenceProperty !== "string") {
    throw new Error(
      chalk.red(
        "Reference Property must be of type string. Change the referenceProperty Parameter within the generator-config file to a valid value."
      )
    );
  }
}
