import * as React from 'react';
import styles from './ServiceDesk.module.scss';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import NewRequest from './newRequest/NewRequest';
import Requests from './requests/Requests';
import { SPFI, SPFx, spfi } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/site-users/web';
import '@pnp/sp/attachments';


const ServiceDesk = ({ context }: { context: WebPartContext }): JSX.Element => {
  const sp: SPFI = spfi().using(SPFx(context));
  return (
    <div className={styles.serviceDesk}>
      <div className={styles.newRequest}><NewRequest sp={sp}/></div>
      <div className={styles.requests}><Requests sp={sp}/></div>
    </div>
  )
}

export default ServiceDesk;
