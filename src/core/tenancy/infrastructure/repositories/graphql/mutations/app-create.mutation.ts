import { gql } from '@apollo/client';

/**
 * Matches `account-api`'s `appCreate` mutation (`app` context). Returns a
 * lightweight ack (`MutationResponseDto`), not the full entity — `slug` is
 * omitted from the input here (auto-generated from `name` server-side when
 * absent), matching the admin "create app" dialog which only asks for a name.
 */
export const APP_CREATE = gql`
  mutation AppCreate($input: AppCreateRequestDto!) {
    appCreate(input: $input) {
      success
      message
      id
    }
  }
`;
