import * as React from 'react';
import * as ReactDom from 'react-dom';
import BluenetServiceRequest from './components/BluenetServiceRequest';
import { IBluenetServiceRequestProps } from './components/IBluenetServiceRequestProps';

export interface IBluenetServiceRequestWebPartProps {
  description: string;
}

export default class BluenetServiceRequestWebPart extends BaseClientSideWebPart<IBluenetServiceRequestWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IBluenetServiceRequestProps> = React.createElement(
      BluenetServiceRequest,
      {
        context: this.context;
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}
