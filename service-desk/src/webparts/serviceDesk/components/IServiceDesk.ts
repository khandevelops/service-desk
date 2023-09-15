import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IItem } from "@pnp/sp/items";

export interface IServiceDeskProps {
  context: WebPartContext
}

export interface IRequest extends Partial<IItem> {
  Id?: number;
  HBN: string;
  HSN: string;
  Category: string;
  SubCategory: string;
  Description: string;
  Priority: string;
  AssignedTo: string;
  SubmittedBy: string;
  CreatedTime: Date;
  CompletedBy?: string;
  CompletedTime?: Date;
  Completed: boolean;
  Comment: string;
  Status: string;
  Attachments: boolean;
  AttachedFiles?: FileList;
}

export interface ICurrentUser {
  Title: string,
}
