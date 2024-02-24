import { PlanCard } from "@/components/plan-card";
import { plans } from "@/constants/route";

const PlansPage = () => {
  return (
    <div className="w-full flex items-center justify-center flex-col p-10 gap-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Choose your plan</h1>
        <p className="text-sm text-black/30">
          Select your plan and discover the limitless possibilities of
          companionship, knowledge, and assistance that await you.
        </p>
      </div>
      <div className="flex items-center justify-center gap-x-4">
        {plans.map((plan) => (
          <PlanCard key={plan.price} plan={plan.title} price={plan.price} />
        ))}
      </div>
    </div>
  );
};

export default PlansPage;
