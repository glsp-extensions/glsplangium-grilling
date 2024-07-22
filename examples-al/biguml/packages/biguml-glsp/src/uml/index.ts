/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { umlSequenceDiagramModule } from './diagram/sequence/di.config';
import { umlActivityDiagramModule } from './representation/activity/activity.module';
import { umlClassDiagramModule } from './representation/class/class.module';
import { umlCommunicationDiagramModule } from './representation/communication/communication.module';
import { umlDeploymentDiagramModule } from './representation/deployment/deployment.module';
import { umlInformationFlowDiagramModule } from './representation/information_flow/di.config';
import { umlPackageDiagramModule } from './representation/package/package.module';
import { umlStateMachineDiagramModule } from './representation/state-machine/state-machine.module';
import { umlUseCaseDiagramModule } from './representation/usecase/use-case.module';
import { umlModule } from './uml.module';

export const umlDiagramModules = [
    umlModule,
    umlClassDiagramModule,
    umlCommunicationDiagramModule,
    umlUseCaseDiagramModule,
    umlPackageDiagramModule,
    umlStateMachineDiagramModule,
    umlDeploymentDiagramModule,
    umlActivityDiagramModule,
    umlInformationFlowDiagramModule,
    umlSequenceDiagramModule
];
