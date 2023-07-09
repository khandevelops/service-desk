import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import Requests from './components/Requests';
import { IRequestsProps } from './components/IRequests';

export interface IRequestsWebPartProps {
  description: string;
}

export default class RequestsWebPart extends BaseClientSideWebPart<IRequestsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IRequestsProps> = React.createElement(
      Requests,
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
