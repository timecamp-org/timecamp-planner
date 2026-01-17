import { ExportDataType, ExportOutputFormat, ExportDataResult } from "../types";
import { AnyDict } from "../../common/types";

export interface ExportServiceInterface {
  export(dataType: ExportDataType, format: ExportOutputFormat, params: AnyDict): PromiseLike<ExportDataResult>;
}
