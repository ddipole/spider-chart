import { EntityMetadataMap } from '@ngrx/data';

export const selectId = <T extends { _id: string }>(entity: T): string => (entity == null ? undefined : entity._id);

const entityMetadata: EntityMetadataMap = {
  users: { selectId },
};

const pluralNames = {
  users: 'users',
};

export const entityConfig = {
  entityMetadata,
  pluralNames,
};
