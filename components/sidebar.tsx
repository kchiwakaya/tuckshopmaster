"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, ShoppingCart, BarChart3, Settings, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    label: "Inventory",
    icon: Package,
    href: "/inventory",
  },
  {
    label: "Sales",
    icon: ShoppingCart,
    href: "/sales",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-muted/50 border-r">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">ShopMaster</h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              <Button
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start", {
                  "bg-secondary": pathname === route.href,
                })}
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}