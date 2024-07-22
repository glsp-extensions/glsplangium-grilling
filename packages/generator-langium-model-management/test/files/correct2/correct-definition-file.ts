import {
  CrossReference,
  ROOT_ELEMENT,
  ABSTRACT_ELEMENT,
} from "../../../src/types";

/**
 * This file has been generated using the langium-model-management generator
 */
interface Root extends ROOT_ELEMENT {
  elements: Array<Element>;
  otherElements: Array<OtherElement>;
  connections: Array<ConnectElementWithOtherElement>;
}
interface Element {
  name: string;
}

interface OtherElement {
  name: string;
}

interface ConnectElementWithOtherElement {
  element: CrossReference<Element>;
  otherElement: CrossReference<OtherElement>;
}
