/******************************************************************************
 * This file was generated by langium-cli 2.1.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

import type { LangiumGeneratedServices, LangiumGeneratedSharedServices, LangiumSharedServices, LangiumServices, LanguageMetaData, Module } from 'langium';
import { WorkflowAstReflection } from './ast.js';
import { WorkflowGrammar } from './grammar.js';

export const WorkflowLanguageMetaData = {
    languageId: 'workflow',
    fileExtensions: ['.wf', '.wfd'],
    caseInsensitive: false
} as const satisfies LanguageMetaData;

export const WorkflowGeneratedSharedModule: Module<LangiumSharedServices, LangiumGeneratedSharedServices> = {
    AstReflection: () => new WorkflowAstReflection()
};

export const WorkflowGeneratedModule: Module<LangiumServices, LangiumGeneratedServices> = {
    Grammar: () => WorkflowGrammar(),
    LanguageMetaData: () => WorkflowLanguageMetaData,
    parser: {}
};