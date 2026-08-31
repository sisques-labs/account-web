import { NextRequest } from 'next/server';
import { internalUrl, proxyTo } from '@/shared/infrastructure/http/proxy';

async function handler(req: NextRequest) {
  return proxyTo(req, internalUrl(`/graphql${req.nextUrl.search}`));
}

export const GET = handler;
export const POST = handler;
