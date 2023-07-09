import { IItem } from "@pnp/sp/items";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IRequestsProps {
  context: WebPartContext
}

export interface IRequest extends IItem {
  id: number;
  Priority: string;
  Category: string;
  SubCategory: string;
  AssignTo: string;
  DueDate: Date;
  Description: string;
  CreatedOn: Date;
  CreatedBy: string;
  CompletedBy?: string;
  CompletedTime?: Date;
  Attachment: boolean;
}

export interface ICurrentUser {
  Title: string,
}
