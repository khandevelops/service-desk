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
  CreatedTime: Date;
  CompletedBy: string;
  CompletedTime: Date;
  SubmittedBy: string;
}
