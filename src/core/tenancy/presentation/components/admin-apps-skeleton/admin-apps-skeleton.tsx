import { Skeleton } from '@/shared/presentation/components/ui/skeleton/skeleton';

function AdminAppsSkeleton() {
  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-6">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
        <Skeleton height={160} />
        <Skeleton height={160} />
      </div>
    </div>
  );
}

AdminAppsSkeleton.displayName = 'AdminAppsSkeleton';

export { AdminAppsSkeleton };
