'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SeamsiIcon from '@/components/SeamsiIcon';

export default function TempleRandomClient({ templeId }: { templeId: string }) {
  const [isShaking, setIsShaking] = useState(false);
  const router = useRouter();

  const onClick = () => {
    if (isShaking) return;
    setIsShaking(true);
    setTimeout(() => {
      router.push(`/fortune/seamsi/temple/${templeId}/random`);
    }, 5000);
  };

  return (
    <button onClick={onClick} className="outline-none">
      <SeamsiIcon size="xl" isAnimating={isShaking} />
    </button>
  );
}


