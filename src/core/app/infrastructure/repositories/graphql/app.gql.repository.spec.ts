import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/infrastructure/http/apollo.client', () => ({
  apolloClient: { query: vi.fn(), mutate: vi.fn() },
}));

import { AppGqlRepository } from './app.gql.repository';
import { apolloClient } from '@/shared/infrastructure/http/apollo.client';

describe('AppGqlRepository', () => {
  let repository: AppGqlRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new AppGqlRepository();
  });

  it('listApps queries appsFindByCriteria with default pagination', async () => {
    const items = [{ id: 'a1', slug: 'app-1', name: 'App 1', createdAt: '', updatedAt: '' }];
    vi.mocked(apolloClient.query).mockResolvedValue({
      data: { appsFindByCriteria: { items, total: 1, page: 1, perPage: 50, totalPages: 1 } },
    } as never);

    const result = await repository.listApps();

    expect(apolloClient.query).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { input: { pagination: { page: 1, perPage: 50 } } } }),
    );
    expect(result.items).toEqual(items);
  });

  it('createApp mutates and returns the created id from the ack', async () => {
    vi.mocked(apolloClient.mutate).mockResolvedValue({
      data: { appCreate: { success: true, message: 'ok', id: 'app-1' } },
    } as never);

    const result = await repository.createApp({ name: 'Gardenia' });

    expect(apolloClient.mutate).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { input: { name: 'Gardenia' } } }),
    );
    expect(result).toEqual({ id: 'app-1' });
  });
});
