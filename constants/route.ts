import { Home, Plus, Settings, Wallet } from "lucide-react";


export const routes = [
    {
      icon: Home,
      href: "/",
      label: "Home",
      pro: false,
    },
    {
      icon: Plus,
      href: "/companion/new",
      label: "Create",
      pro: true,
    },
    {
      icon: Wallet,
      href: "/plans",
      label: "Plans",
      pro: true,
    },
    {
      icon: Settings,
      href: "/settings",
      label: "Settings",
      pro: false,
    },
  ] as const;


export const plans = [
    {
      title: "Free",
      price: 0
    },
    {
      title: "Standard",
      price: 9.99
    },
    {
      title: "Enterprise",
      price: 19.99
    },
  ] as const;