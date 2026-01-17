import { AnyDict } from '../types';

export function doNothing() {}

export function ellipsizeInTheMiddle(value: string, maxLength: number): string {
  if (!value) return value;
  if (maxLength < 1) return value;
  if (value.length <= maxLength) return value;
  if (maxLength === 1) return `${value.substring(0, 1)}...`;

  const midpoint = Math.ceil(value.length / 2);
  const toremove = value.length - maxLength;
  const lstrip = Math.ceil(toremove / 2);
  const rstrip = toremove - lstrip;
  return `${value.substring(0, midpoint - lstrip)}...${value.substring(midpoint + rstrip)}`;
}

export function ellipsizeInTheEnd(value: string, maxLength: number): string {
  if (!value || !maxLength) return value;
  if (maxLength < 1) return value;
  if (value.length <= maxLength) return value;
  if (maxLength === 1) return `${value.substring(0, 1)}...`;

  return `${value.substring(0, maxLength).trimEnd()}...`;
}

export function stretchElementToBottomWithMargin(element: Element, margin: number = 0): number {
  if (element) {
    return window.innerHeight - element.getBoundingClientRect().top - 200 - margin;
  } else {
    throw new Error("You need to pass existing HTML element in order to stretch it's height");
  }
}

export function getJsonObjectProperty(property: string): AnyDict {
  let value;
  try {
    value = JSON.parse(property);
  } catch (error) {
    value = property;
  }
  return value;
}

export function escapeRegExp(str: string): string {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); // eslint-disable-line no-useless-escape
}

export type InjectedParam = {
  key: string;
  defaultValue?: any;
};

export function extractParamsToInject(paramsToInject: InjectedParam[], props: AnyDict): any[] {
  const args = [];
  paramsToInject.reduce((acc, param) => {
    let value = props[param.key];
    if (typeof value === 'undefined') {
      value = param.defaultValue;
    }
    acc.push(value);
    return acc;
  }, args);
  return args;
}

export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function onOpenLink(url: string): void {
  window.open(url);
}

export function extractFullNameParts(fullName: string): string[] {
  return fullName.trim().split(' ');
}

export function onStopPropagation(event: Event): void {
  if (event) {
    event.stopPropagation();
  }
}
