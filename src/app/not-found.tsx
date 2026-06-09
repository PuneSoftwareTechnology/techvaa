import Link from "next/link";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-heading text-7xl font-extrabold text-brand">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
        get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="accent" size="xl">
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline" size="xl">
          <Link href="/courses">Browse courses</Link>
        </Button>
      </div>
    </Container>
  );
}
