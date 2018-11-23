import { IInstance } from 'types';
import {
  SelectAPI,
  SetupAPI
} from '../';

/**
 * Convert an API instance into a SelectAPI instance.
 */
export function apiToSelectAPI(api: IInstance.API): IInstance.SelectAPI {
  return SelectAPI({
    select: api.select,
    source: api.source
  });
}

/**
 * Convert an API instance into a DataAPI instance.
 */
export function apiToSetupAPI(api: IInstance.API): IInstance.SetupAPI {
  return SetupAPI({
    action: api.action,
    store: api.store,
    source: api.source
  });
}
