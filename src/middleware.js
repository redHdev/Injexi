import { NextResponse } from 'next/server';
import rateLimit from './util/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

export async function middleware(req) {

  const res = NextResponse.next();

  try {

    const headers =  await limiter.check(30, 'CACHE_TOKEN'); // 10 requests per minute
    for (const [key, value] of Object.entries(headers)) {
      res.headers.set(key, value.toString());
    }
    console.log("limiter pass");

    return res;

  } catch (error) {
    return new Response("Rate limit exceeded", { status: 429 });
  }
}

export const config = {
  matcher: ["/api/(.*)"],
};
