import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PlanCardProps {
  plan: string;
  price: number;
}

export const PlanCard = ({ plan, price }: PlanCardProps) => {
  return (
    <div className="flex flex-col rounded-md justify-between items-center bg-slate-500/10 h-96 w-60 py-10">
      <div className="flex flex-col items-center space-y-4">
        <h3>{plan}</h3>
        <p className="text-3xl font-bold">
          {price}
          <span className="text-xs font-medium">/month</span>
        </p>
      </div>
      <div>
        <ul className="text-xs space-y-4 text-black/30">
          <li className="flex">
            <Check className="w-4 h-4 text-primary mr-1" />
            500 request
          </li>
          <li className="flex">
            <Check className="w-4 h-4 text-primary mr-1" />
            Unlimited Characters
          </li>
          <li className="flex">
            <Check className="w-4 h-4 text-primary mr-1" />
            Extended free trial
          </li>
        </ul>
      </div>
      <Button
        variant={plan === "Free" ? "secondary" : "default"}
        className={cn("rounded-sm")}
      >
        {plan === "Free" ? "Your plan" : "Get Started"}
      </Button>
    </div>
  );
};
