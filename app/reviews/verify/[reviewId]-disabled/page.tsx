// app/reviews/verify/[reviewId]/page.tsx

import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { VerificationClient } from './VerificationClient';

interface VerifyPageProps {
  params: { reviewId: string };
}

export { generateStaticParams } from './static-params';

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { reviewId } = params;
  const reviewFile = path.join(process.cwd(), 'data', 'reviews', `${reviewId}.json`);

  try {
    await fs.access(reviewFile);
  } catch {
    notFound();
  }

  return <VerificationClient reviewId={reviewId} />;
}

export async function generateMetadata() {
  return {
    title: 'Verify Your Testimonial',
    description: 'Complete the verification process for your testimonial submission.',
  };
}
