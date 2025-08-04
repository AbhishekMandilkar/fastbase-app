"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {toast} from "sonner";
import {Loader2} from "lucide-react";

export function WaitlistDialog() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const resetState = () => {
    setEmail("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {

      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/waitlist", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setEmail("");
        toast.success("Welcome to the waitlist!");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to join waitlist. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-x-4 flex items-center justify-center transition-all duration-300"
    >
      <Input
        type="email"
        className=" sm:min-w-[300px] transition-all duration-300"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        required
        disabled={isLoading}
      />
      <Button type="submit" className=" transition-all duration-300 w-[150px]" disabled={isLoading}>
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Join Now"}
      </Button>
    </form>
  );
}
