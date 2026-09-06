import { Skeleton } from '@/shared/presentation/components/ui/skeleton/skeleton';

function AdminAppDetailSkeleton() {
  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Skeleton variant="line" />
        <Skeleton variant="line" />
        <Skeleton variant="line" />
      </div>
    </div>
  );
}

AdminAppDetailSkeleton.displayName = 'AdminAppDetailSkeleton';

export { AdminAppDetailSkeleton };
