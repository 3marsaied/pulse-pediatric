import { cn } from "@/utils/cn";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-screen-2xl mx-auto pt-8",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    description,
    header,
}: {
    className?: string;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "row-span-4 md:row-span-2 rounded-xl group/bento hover:shadow-md transition duration-200 shadow-input p-2 bg-white border border-transparent justify-between flex flex-col space-y-4",
                className
            )}
        >
            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-200">
                <div className="font-sans font-normal text-neutral-600 text-md">
                    {description}
                </div>
            </div>
        </div>
    );
};
