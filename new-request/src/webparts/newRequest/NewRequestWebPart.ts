import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import NewRequest from './components/NewRequest';
import { INewRequestProps } from './components/INewRequestProps';

export interface INewRequestWebPartProps {
  description: string;
}

export default class NewRequestWebPart extends BaseClientSideWebPart<INewRequestWebPartProps> {

  public render(): void {
    const element: React.ReactElement<INewRequestProps> = React.createElement(
      NewRequest,
      {
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}
