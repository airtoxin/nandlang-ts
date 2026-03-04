import { Reactive } from "@reactively/core";
import { Module } from "./module";

export class Variable {
  constructor(
    public readonly name: string,
    public readonly inPorts: Map<string, Reactive<boolean>>,
    public readonly outPorts: Map<string, Reactive<boolean>>,
  ) {}
}
