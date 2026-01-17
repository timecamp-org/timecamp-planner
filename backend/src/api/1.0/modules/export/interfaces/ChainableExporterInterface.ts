import { ExportDataType, ExportOutputFormat, ExportDataResult, ExportData, ExporterType } from "../types";
import { AnyDict } from "../../common/types";
import { Response } from "express";

export interface ChainableExporterInterface {
  setNextExporter(exporter: ChainableExporterInterface): void;
  export(dataType: ExportDataType, format: ExportOutputFormat, params: AnyDict): PromiseLike<ExportDataResult>;
  getExporterType(): ExporterType;
  handleResponse(res: Response, result: ExportData): void;
}
