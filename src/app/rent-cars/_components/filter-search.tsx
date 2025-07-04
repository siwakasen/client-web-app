"use client";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface FilterSearchProps {
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  maxGroupSize: string;
  setMaxGroupSize: (value: string) => void;
}

export {};

export function FilterSearch({
  maxPrice,
  setMaxPrice,
  maxGroupSize,
  setMaxGroupSize,
}: FilterSearchProps) {
  return (
    <>
      <Card className="p-6 mb-6 lg:mb-0">
        <h3 className="text-lg font-semibold mb-4">Filter</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="max-price" className="mb-2">
              Max Price
            </Label>
            <Input
              id="max-price"
              type="number"
              placeholder="Enter max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="max-group" className="mb-2">
              Max Group Size
            </Label>
            <Input
              id="max-group"
              type="number"
              placeholder="Enter max group size"
              value={maxGroupSize}
              onChange={(e) => setMaxGroupSize(e.target.value)}
            />
          </div>
        </div>
      </Card>
    </>
  );
}
