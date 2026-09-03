/**
 * Mirrors `account-api`'s `AppResponseDto` (GraphQL `app` context) exactly —
 * id/slug/name/createdAt/updatedAt. The backend does not return
 * tenant/user counts on this DTO, so this frontend context does not
 * fabricate them.
 */
export interface App {
  id: string;
  slug: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
