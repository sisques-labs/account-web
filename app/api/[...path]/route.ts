import { NextRequest } from 'next/server';
import { internalUrl, proxyTo } from '@/shared/infrastructure/http/proxy';

type Params = Promise<{ path: string[] }>;

async function handler(req: NextRequest, { params }: { params: Params }) {
  const { path } = await params;
  return proxyTo(req, internalUrl(`/api/${path.join('/')}${req.nextUrl.search}`));
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
