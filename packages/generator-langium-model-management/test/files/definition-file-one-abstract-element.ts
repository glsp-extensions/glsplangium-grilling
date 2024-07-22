import {
  CrossReference,
  ROOT_ELEMENT,
  ABSTRACT_ELEMENT,
} from "../../src/types";

/**
 * This file has been generated using the langium-model-management generator
 */

// This line defines which element is the root element of your language
// DO NOT EDIT THIS LINE, THIS CAN BREAK YOUR ENTIRE LANGUAGE
const ENTRY = Symbol("Element");

interface Element extends ROOT_ELEMENT {
  element: Element;
}
interface Element1 extends ABSTRACT_ELEMENT {}
