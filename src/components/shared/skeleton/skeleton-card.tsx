import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 min-w-[250px]">
      <Skeleton className="h-[200px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 " />
        <Skeleton className="h-4 " />
      </div>
    </div>
  );
}
