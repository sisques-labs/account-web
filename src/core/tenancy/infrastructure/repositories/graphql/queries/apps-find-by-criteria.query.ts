import { gql } from '@apollo/client';

/** Matches `account-api`'s `appsFindByCriteria` query (`app` context, unauthenticated). */
export const APPS_FIND_BY_CRITERIA = gql`
  query AppsFindByCriteria($input: AppFindByCriteriaRequestDto) {
    appsFindByCriteria(input: $input) {
      items {
        id
        slug
        name
        createdAt
        updatedAt
      }
      total
      page
      perPage
      totalPages
    }
  }
`;
