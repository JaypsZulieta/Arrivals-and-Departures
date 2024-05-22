import { AdminPermissionsFilter, OwnerPermissionsFilter } from './auth.guard';

export const permissionsFilterChain = new AdminPermissionsFilter();
permissionsFilterChain.setNextFilter(new OwnerPermissionsFilter());
