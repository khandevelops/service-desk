import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IServiceDeskProps {
  context: WebPartContext
}

import { IItem } from "@pnp/sp/items";

export interface IRequest extends IItem {
  id: number;
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
  Attachment: boolean;
  File: FileList;
}

export interface ICurrentUser {
  Title: string,
}
