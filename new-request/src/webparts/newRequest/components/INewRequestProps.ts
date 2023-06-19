import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface INewRequestProps {
  context: WebPartContext
}

export interface IRequest {
  Subject: string;
  Priority: string;
  Category: string;
  SubCategory: string;
  AssignTo: string;
  DueDate: Date;
  Description: string;
  RequesterEmail: string;
  CompletedBy?: string;
  CompletedTime?: Date;
  Attachments?: boolean;
  Attached?: FileList;
}
