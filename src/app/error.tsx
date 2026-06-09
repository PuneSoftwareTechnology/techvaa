"use client";

import { useEffect } from "react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for observability; replace with your logger of choice.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="font-heading text-2xl font-bold text-foreground">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again — if it keeps happening,
        contact our team.
      </p>
      <div className="mt-8">
        <Button onClick={reset} variant="accent" size="xl">
          Try again
        </Button>
      </div>
    </Container>
  );
}
