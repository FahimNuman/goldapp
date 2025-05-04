"use client";

import GoldCalculator from '@/components/goldCalculator';
import MetadataWrapper from './metadata';

export default function Home() {
  return (
    <MetadataWrapper>
      <GoldCalculator />
    </MetadataWrapper>
  );
}