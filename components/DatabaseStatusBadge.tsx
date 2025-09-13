import { Badge } from "@/components/ui/badge";
import { dbConnectionStatus } from "@/db/connection-status";

export async function DatabaseStatusBadge() {
  const dbStatus = await dbConnectionStatus();
  
  return (
    <Badge
      variant={dbStatus === "Database connected" ? "default" : "destructive"}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap sm:flex-shrink-0 ${
        dbStatus === "Database connected"
          ? "border-[#00ED64]/20 bg-[#00ED64]/10 text-[#00684A] dark:bg-[#00ED64]/10 dark:text-[#00ED64]"
          : "border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-500"
      }`}
    >
      {dbStatus}
    </Badge>
  );
}