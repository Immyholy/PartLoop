
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { demo } from "@/services/demo-store";
import { ROLE_LABEL, ROLES, type Role } from "@/types";

const searchSchema = z.object({
  next: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in or Register — PartLoop" },
      {
        name: "description",
        content: "Create your PartLoop account or sign in securely.",
      },
    ],
  }),
  component: AuthPage,
});

type AuthMode = "signin" | "signup";
type AuthStep = "form" | "verify";

type AuthenticatedUser = {
  id: string;
  email?: string | null;
  user_metadata?: {
    name?: unknown;
    role?: unknown;
  };
};

function safeNext(next?: string) {
  if (
    !next ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.includes("\\") ||
    next.startsWith("/auth")
  ) {
    return "/account";
  }

  return next;
}

// Temporary compatibility with existing PartLoop account screens.
// This function is ONLY called after Supabase verifies a real session.
function activateAccount(user: AuthenticatedUser) {
  const metadata = user.user_metadata ?? {};

  const role = ROLES.includes(metadata.role as Role)
    ? (metadata.role as Role)
    : "buyer";

  const name =
    typeof metadata.name === "string" && metadata.name.trim()
      ? metadata.name.trim()
      : user.email?.split("@")[0] ?? "Member";

  demo.signIn({
    id: user.id,
    name,
    email: user.email ?? "",
    role,
    source: "supabase",
  });
}

function AuthPage() {
  const router = useRouter();
  const { next } = Route.useSearch();

  const configured = isSupabaseConfigured();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [step, setStep] = useState<AuthStep>("form");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("buyer");
  const [code, setCode] = useState("");

  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  const goToAccount = () => {
    router.history.push(safeNext(next));
  };

  // Restore only sessions validated by Supabase.
  useEffect(() => {
    let active = true;
    const supabase = getSupabase();

    if (!supabase) {
      demo.signOut();
      setChecking(false);
      return;
    }

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!active) return;

        if (!error && data.user) {
          activateAccount(data.user);
          setSignedIn(true);
        } else {
          demo.signOut();
          setSignedIn(false);
        }
      })
      .catch(() => {
        if (active) {
          demo.signOut();
          setSignedIn(false);
        }
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const sendCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const supabase = getSupabase();

    if (!supabase) {
      toast.error("Account registration is not available yet.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (mode === "signup" && name.trim().length < 2) {
      toast.error("Please enter your full name.");
      return;
    }

    setBusy(true);

    try {
      const options =
        mode === "signup"
          ? {
              shouldCreateUser: true,
              data: {
                name: name.trim(),
                role,
              },
            }
          : {
              shouldCreateUser: false,
            };

      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options,
      });

      if (error) throw error;

      setEmail(cleanEmail);
      setCode("");
      setStep("verify");

      toast.success("Check your email for your sign-in instructions.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send email. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const supabase = getSupabase();

    if (!supabase) {
      toast.error("Authentication is not available yet.");
      return;
    }

    const cleanCode = code.trim();

    if (!/^\d{6,8}$/.test(cleanCode)) {
      toast.error("Enter the verification code from your email.");
      return;
    }

    setBusy(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: cleanCode,
        type: "email",
      });

      if (error) throw error;

      if (!data.user || !data.session) {
        throw new Error("Verification did not create a session.");
      }

      activateAccount(data.user);
      setSignedIn(true);

      toast.success("Welcome to PartLoop!");
      goToAccount();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Verification failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);

    try {
      const supabase = getSupabase();

      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }

      demo.signOut();
      setSignedIn(false);
      setStep("form");
      setCode("");

      toast.success("You've signed out successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to sign out."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-[75dvh] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-xl shadow-black/5 sm:p-9">

          {checking ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Checking your account...
            </div>
          ) : signedIn ? (
            <div className="space-y-6 py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
                ✓
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  You're signed in
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                  Welcome back to PartLoop.
                </p>
              </div>

              <Button
                className="h-12 w-full rounded-xl"
                onClick={goToAccount}
              >
                Continue to your account
              </Button>

              <Button
                variant="outline"
                className="h-12 w-full rounded-xl"
                disabled={busy}
                onClick={signOut}
              >
                Sign out
              </Button>
            </div>
          ) : step === "verify" ? (
            <div>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl text-green-700">
                  ✉
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Check your email
                </h1>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Enter the verification code sent to
                </p>

                <p className="mt-1 break-all font-semibold">
                  {email}
                </p>
              </div>

              <form onSubmit={verifyCode} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="verification-code">
                    Verification code
                  </Label>

                  <Input
                    id="verification-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="Enter your code"
                    value={code}
                    onChange={(event) =>
                      setCode(event.target.value)
                    }
                    maxLength={8}
                    required
                    className="h-12 rounded-xl text-center text-lg tracking-widest"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={busy || !configured}
                  className="h-12 w-full rounded-xl font-semibold"
                >
                  {busy ? "Verifying..." : "Verify and continue"}
                </Button>

                <button
                  type="button"
                  className="w-full py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setStep("form");
                    setCode("");
                  }}
                >
                  Change email or request a new code
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl font-bold text-green-700">
                  P
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {mode === "signin"
                    ? "Welcome back"
                    : "Join PartLoop"}
                </h1>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {mode === "signin"
                    ? "Sign in to connect with the PartLoop marketplace."
                    : "Create your account to buy, sell, and discover reusable electronics."}
                </p>
              </div>

              <div className="mb-7 grid grid-cols-2 rounded-xl bg-secondary/70 p-1">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={`rounded-lg px-3 py-3 text-sm font-semibold transition-all ${
                    mode === "signin"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Sign in
                </button>

                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`rounded-lg px-3 py-3 text-sm font-semibold transition-all ${
                    mode === "signup"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Create account
                </button>
              </div>

              <form onSubmit={sendCode} className="space-y-5">
                {mode === "signup" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="full-name">
                        Full name
                      </Label>

                      <Input
                        id="full-name"
                        value={name}
                        onChange={(event) =>
                          setName(event.target.value)
                        }
                        autoComplete="name"
                        placeholder="Enter your full name"
                        required
                        className="h-12 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="account-role">
                        I want to join as
                      </Label>

                      <Select
                        value={role}
                        onValueChange={(value) =>
                          setRole(value as Role)
                        }
                      >
                        <SelectTrigger
                          id="account-role"
                          className="h-12 rounded-xl"
                        >
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>

                        <SelectContent>
                          {ROLES.map((item) => (
                            <SelectItem
                              key={item}
                              value={item}
                            >
                              {ROLE_LABEL[item]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email-address">
                    Email address
                  </Label>

                  <Input
                    id="email-address"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                    className="h-12 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={busy || !configured}
                  className="h-12 w-full rounded-xl text-sm font-semibold"
                >
                  {busy
                    ? "Please wait..."
                    : "Continue with email"}
                </Button>

                {!configured && (
                  <p
                    role="status"
                    className="text-center text-xs leading-5 text-muted-foreground"
                  >
                    Account registration is being prepared.
                    Please try again shortly.
                  </p>
                )}
              </form>

              <p className="mt-7 text-center text-xs leading-5 text-muted-foreground">
                By continuing, you agree to the PartLoop
                Terms of Service and Privacy Policy.
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Connecting people, devices, and possibilities.
        </p>
      </div>
    </main>
  );
}
