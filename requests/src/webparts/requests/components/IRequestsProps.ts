import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IRequestsProps {
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
  CreatedOn: Date;
  CreatedBy: string;
}

export interface ICurrentUser {
  Title: string,
}
