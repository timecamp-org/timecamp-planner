import { ExportDataType, ExportOutputFormat, ExportDataResult } from "../types";
import { AnyDict } from "../../common/types";
import { ChainableExporterInterface } from "./ChainableExporterInterface";

export interface ExporterChainInterface {
  registerExporter(exporter: ChainableExporterInterface): void;
  export(dataType: ExportDataType, format: ExportOutputFormat, params: AnyDict): PromiseLike<ExportDataResult>;
}
