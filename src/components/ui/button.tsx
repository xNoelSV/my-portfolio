import { cn } from "@/lib/utils";

export default function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        `flex justify-center rounded-md transition p-2.5
         hover:bg-gray-200
         dark:hover:bg-gray-800`,
        { className }
      )}
      {...props}
    >
      {children}
    </button>
  );
}
