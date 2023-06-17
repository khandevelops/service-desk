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
  RequesterEmail: string;
  Description: string;
  CompletedTime?: Date,
  CompletedBy?: string
}

export interface IForm {
  label: keyof IRequest, value: string; error: string; required: boolean;
}
