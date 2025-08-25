// app/reviews/verify/[reviewId]/static-params.ts
import { promises as fs } from 'fs';
import path from 'path';

export async function generateStaticParams() {
  const reviewsDir = path.join(process.cwd(), 'data', 'reviews');

  let files: string[] = [];
  try {
    files = await fs.readdir(reviewsDir);
  } catch {
    return []; // if no reviews folder exists, return empty
  }

  return files
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({
      reviewId: f.replace(/\.json$/, ''),
    }));
}
