/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { DefaultLangiumDocuments } from 'langium';
import { URI } from 'vscode-uri';
import { isPackageUri } from './workflow-diagram-package-manager.js';
import { Utils } from './util/uri-util.js';

export class WorkflowDiagramLangiumDocuments extends DefaultLangiumDocuments {
   override getOrCreateDocument(uri: URI): any {
      // only create documents for actual language files but not for package.json
      return isPackageUri(uri) ? undefined : super.getOrCreateDocument(Utils.toRealURI(uri));
   }
}