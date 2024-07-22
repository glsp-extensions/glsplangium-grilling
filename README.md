# langium-extensions

The artifacts created within the scope of the master theses of Adam Lencses and David Jäger at the Vienna University of Technology.

## Requirements

- `node`: ">=18.0.0",
- `yarn`: ">=1.7.0 <2.x.x"

## Install

To build the model server and the developed examples run the `install.sh` script in the root folder. After that you can start one of the tasks in the VS Code Run and Debug sidebar. To open the GLSP editor klick or create a .wf file in the Workflow Example or klick on an existing .uml file in the bigUML example (note that for this the file already has to contain the basic JSON textual structure of the model). The .wfd file for the Workflow example also has to be created if not yet exists, and that will automatically open in the text editor.

In the blended modeling examples, to open the text editor right klick on a model file and select Open with... Text editor, and split the screen to see both editors side-by-side.

## Packages

The `packages` folder contains the created model service and generator. To generate a new build run `yarn install` and `yarn build` in the appropriate service folder. To update the dependencies in the examples go to the corresponding server folder of the example and run `yard upgrade model-service` or `yard upgrade generator-langium-model-management`.

## Examples - AL

The repository contains following examples to showcase the implemented packages.

### Workflow

- glsp-vscode-integration
- server-blended-modeling

To run the Workflow language example with the blended modeling backend build both projects: `glsp-vscode-integration` and `server-blended-modeling` by navigating to each folder and running `yarn install` and `yarn prepare`. After that you can start the generated extension by going to the `Run and Debug` VS Code sidebar and running the `Workflow Blended Modeling Example` task. To debug the implementation also run `Attach to Workflow Blended Modeling Server` after the extension has started.

### bigUML

To run the bigUML example with the blended modeling backend run `yarn install` for the first time and `yarn build` for following builds in the `biguml` directory. After that you can start the generated extension by going to the `Run and Debug` VS Code sidebar and running the `BIGUML Blended Modeling Example` task. To debug the implementation also run `Attach to BIGUML Blended Modeling Server` after the extension has started.

To change the diagram type the bigUML extension is currently operating on, change the imported diagram module in
`langium-extensions/examples-al/biguml/packages/biguml-server/src/glsp-server/launch.ts` in line 40.
Currently available options are the PackageDiagramModule and ClassDiagramModule.

## Examples - DJ

The examples-dj folder also conists of the Workflow Diagram example and the bigUML example.

### Workflow

- glsp-vscode-integration
- workflow-server

To run the Workflow language example, where the language has been built using the Typescript-based grammar language, both the `glsp-vscode-integration` and `workflow-server` package have to be built. For that, navigate to the repsective folder and execute `yarn install` and `yarn prepare`. After that you can start the generated extension by going to the `Run and Debug` VS Code sidebare and running the `(Workflow) GLSP VSCode Extension`.

### bigUML

For the bigUML example, follow the steps that have been explained in Example - AL -> bigUML and start the bigUML modeling tool by going to the `Run and Debug` VS Code sidebar and run `(bigUML) GLSP VSCode Extension`.

### Metamodel update

To change the metamodel of either examples, open the `def.ts` file in `workflow-server/src/language-server/definition` or `biguml-server/src/language-server/definition` and make the required changes. After the definition has been updated run the `yarn generate` command to rebuild the metamodel. By making changes to the metamodel definition it is possible that either examples may not work anymore.
