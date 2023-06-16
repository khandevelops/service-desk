import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import Dashboard from './components/Dashboard';
import { IDashboardProps } from './components/IDashboardProps';

export interface IDashboardWebPartProps {
  description: string;
}

export default class DashboardWebPart extends BaseClientSideWebPart<IDashboardWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDashboardProps> = React.createElement(
      Dashboard,
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
