import { AnyDict } from "../../common/types";
import { SendDataToProcessResponse, ProcessName, SendRequestToProcessResponse, ProcessMessage } from "../types";

export interface ProcessCommunicationInterface {
  sendMessageToProcess(processName: ProcessName, processMessage: ProcessMessage): PromiseLike<SendDataToProcessResponse>;
  createMessageAndSendToProcess(processName: ProcessName, data: AnyDict): PromiseLike<SendDataToProcessResponse>;
  sendRequestToProcess(processName: ProcessName, data: AnyDict): PromiseLike<SendRequestToProcessResponse>;
}
