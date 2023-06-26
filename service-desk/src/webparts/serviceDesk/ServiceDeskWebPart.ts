import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import ServiceDesk from './components/ServiceDesk';
import { IServiceDeskProps } from './components/IServiceDeskProps';

export interface IServiceDeskWebPartProps {
  description: string;
}

export default class ServiceDeskWebPart extends BaseClientSideWebPart<IServiceDeskWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IServiceDeskProps> = React.createElement(
      ServiceDesk,
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
