import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function Header({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <header
            className={cn(
                "sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6",
                className
            )}
            {...props}
        >
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
            <div className="flex-1">
                <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
            <ThemeToggle />
            <UserNav />
        </header>
    )
}
