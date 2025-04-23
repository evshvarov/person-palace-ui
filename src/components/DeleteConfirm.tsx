
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function DeleteConfirm({ open, onClose, onConfirm, loading }: Props) {
  return (
    <Popover open={open} onOpenChange={(open) => !open && onClose()}>
      <PopoverContent className="w-[340px]" align="center">
        <div className="flex flex-col items-center gap-3">
          <div className="text-lg font-semibold text-destructive">Delete this person?</div>
          <div className="text-gray-500 mb-3 text-center">
            This action cannot be undone.
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button variant="destructive" onClick={onConfirm} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
