"use client";

import { useState } from "react";
import axios from "axios";
import { Sparkle } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export const SubscriptionButton = ({ isPro }: { isPro: boolean }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onClick = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      onClick={onClick}
      size={"sm"}
      variant={isPro ? "default" : "premium"}
    >
      {isPro ? "Manage Subscription" : "Upgrade"}
      {!isPro && <Sparkle className="h-4 w-4 ml-2 fill-white" />}
    </Button>
  );
};
