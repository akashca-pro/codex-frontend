import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
    return (
        <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-1/4" />
            <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-[180px]" />
                <Skeleton className="h-10 w-[180px]" />
            </div>
            <Skeleton className="h-64 w-full" />
        </div>
    );
}

export default Loading
