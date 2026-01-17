import { GetContextResult, ExportOutputFormat } from "../types";

export interface ExportDataProviderInterface<T1, T2, R> {
  getContext(params: T1): PromiseLike<GetContextResult<T2>>;
  formatOutput(format: ExportOutputFormat, context: T2): R;
}
