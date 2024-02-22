"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { userProModal } from "@/hooks/use-pro-modal";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import axios from "axios";

export const ProModal = () => {
  const proModal = userProModal();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);

      const response = await axios.get("api/stripe");

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
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">Upgrade to Pro</DialogTitle>
          <DialogDescription className="text-center space-y-2">
            Create{" "}
            <span className="text-sky-500 mx-1 font-medium">Custom AI</span>{" "}
            Characters!!!
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex justify-between">
          <p className="text-2xl font-medium">
            $9
            <span className="text-sm font-normal">.99 / mo</span>
          </p>
          <Button disabled={loading} onClick={onSubscribe} variant={"premium"}>
            Subscribe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
