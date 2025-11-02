"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";

const SignIn = () => {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();

  // Combined form state to reduce re-renders
  const [form, setForm] = useState({
    email: "",
    password: "",
    loading: false,
    googleLoading: false,
    githubLoading: false,
  });

  // Debounced values
  const [debouncedValues, setDebouncedValues] = useState({
    email: "",
    password: "",
  });

  // Validation states
  const [validation, setValidation] = useState({
    emailValid: true,
    passwordValid: true,
  });

  // Validation error messages
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Show captcha state
  const [showCaptcha, setShowCaptcha] = useState(false);

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValues({
        email: form.email,
        password: form.password,
      });

      // Validate on debounce
      if (form.email) validateField("email", form.email);
      if (form.password) validateField("password", form.password);
    }, 300);

    return () => clearTimeout(timer);
  }, [form.email, form.password]);

  // Email validation function
  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  // Password validation function
  const validatePassword = useCallback((password: string) => {
    return password.length >= 8;
  }, []);

  // Field validation function
  const validateField = useCallback(
    (field: string, value: string) => {
      let isValid = true;
      let errorMessage = "";

      if (field === "email") {
        if (!value) {
          isValid = false;
          errorMessage = "Email is required";
        } else if (!validateEmail(value)) {
          isValid = false;
          errorMessage = "Please enter a valid email address";
        }

        setValidation((prev) => ({ ...prev, emailValid: isValid }));
        setErrors((prev) => ({ ...prev, email: errorMessage }));
      }

      if (field === "password") {
        if (!value) {
          isValid = false;
          errorMessage = "Password is required";
        } else if (!validatePassword(value)) {
          isValid = false;
          errorMessage = "Password must be at least 8 characters";
        }

        setValidation((prev) => ({ ...prev, passwordValid: isValid }));
        setErrors((prev) => ({ ...prev, password: errorMessage }));
      }

      return isValid;
    },
    [validateEmail, validatePassword]
  );

  // Input change handler with validation
  const handleInputChange = useCallback(
    (field: keyof typeof form, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      validateField(field, value);
    },
    [validateField]
  );

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      validation.emailValid &&
      validation.passwordValid &&
      form.email.length > 0 &&
      form.password.length > 0
    );
  }, [
    validation.emailValid,
    validation.passwordValid,
    form.email,
    form.password,
  ]);

  const handleEmailSignIn = useCallback(async () => {
    if (!isLoaded || form.loading) return;

    // Validate all fields before submission
    const isEmailValid = validateField("email", form.email);
    const isPasswordValid = validateField("password", form.password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      setForm((prev) => ({ ...prev, loading: true }));
      const result = await signIn.create({
        identifier: debouncedValues.email,
        password: debouncedValues.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
        toast.success("Signed in successfully!");
      }
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "Sign in failed");
    } finally {
      setForm((prev) => ({ ...prev, loading: false }));
    }
  }, [
    isLoaded,
    signIn,
    debouncedValues,
    form.loading,
    form.email,
    form.password,
    router,
    setActive,
    validateField,
  ]);

  const handleGoogleSignIn = useCallback(async () => {
    if (!isLoaded || form.googleLoading) return;

    try {
      setForm((prev) => ({ ...prev, googleLoading: true }));

      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      toast.error("Failed to sign in with Google. Please try again.");
    } finally {
      setForm((prev) => ({ ...prev, googleLoading: false }));
    }
  }, [isLoaded, signIn, form.googleLoading]);

  const handleGitHubSignIn = useCallback(async () => {
    if (!isLoaded || form.githubLoading) return;

    setShowCaptcha(true);

    try {
      setForm((prev) => ({ ...prev, githubLoading: true }));

      await signIn.authenticateWithRedirect({
        strategy: "oauth_github",
        redirectUrl: "/",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      console.error("GitHub sign in error:", err);
      toast.error("Failed to sign in with GitHub. Please try again.");
    } finally {
      setForm((prev) => ({ ...prev, githubLoading: false }));
    }
  }, [isLoaded, signIn, form.githubLoading]);

  // Memoized UI components
  const LogoSection = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Nitro Logo"
          width={32}
          height={32}
          className="object-contain"
        />
        <span className="text-xl font-bold text-white">Nitro</span>
      </div>
    ),
    []
  );

  const GoogleIcon = useMemo(
    () => (
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
    []
  );

  const GitHubIcon = useMemo(
    () => (
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="white">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    []
  );

  return (
    <main className="flex flex-row w-full min-h-screen bg-gradient-to-b from-slate-0/20 via-black/70 to-cyan-950/20">
      <div className="flex w-3/5 items-center justify-center p-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm relative overflow-hidden"
        >
          <div className="flex flex-col space-y-6 p-8 relative">
            {LogoSection}

            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Welcome back
              </h1>
              <p className="text-zinc-400 text-xs">
                Sign in to continue building with Nitro
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={
                    !validation.emailValid && form.email
                      ? "border-zinc-500"
                      : ""
                  }
                  onBlur={(e) => validateField("email", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={
                      !validation.passwordValid && form.password
                        ? "border-zinc-500 pr-10"
                        : "pr-10"
                    }
                    onBlur={(e) => validateField("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-300"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white h-9 text-sm"
              onClick={handleEmailSignIn}
              disabled={
                !isFormValid ||
                form.loading ||
                form.googleLoading ||
                form.githubLoading
              }
            >
              {form.loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Signing in</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Only show captcha when showCaptcha is true */}
            {showCaptcha && <div id="clerk-captcha" className="" />}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-700"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-black px-2 text-zinc-500">
                  or continue with
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                className="flex-1 h-9 text-sm border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700/50 text-white"
                disabled={
                  form.loading || form.googleLoading || form.githubLoading
                }
              >
                {form.googleLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Signing in</span>
                  </div>
                ) : (
                  <>
                    {GoogleIcon}
                    Google
                  </>
                )}
              </Button>

              <Button
                onClick={handleGitHubSignIn}
                variant="outline"
                className="flex-1 h-9 text-sm border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700/50 text-white"
                disabled={
                  form.loading || form.googleLoading || form.githubLoading
                }
              >
                {form.githubLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Signing in</span>
                  </div>
                ) : (
                  <>
                    {GitHubIcon}
                    GitHub
                  </>
                )}
              </Button>
            </div>

            <div className="text-center">
              <span className="text-zinc-400 text-xs">
                Don't have an account?{" "}
                <a
                  href="/sign-up"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  Sign up
                </a>
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex w-2/5 bg-black/30 backdrop-blur-sm items-center justify-center p-12 border-l border-zinc-800/50 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-sm"
        >
          <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 via-zinc-800/30 to-pink-500/20 p-6 backdrop-blur-xl border border-zinc-700/50 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-full flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Nitro Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Build Faster</h2>
                <p className="text-zinc-400 text-xs">With Nitro AI</p>
              </div>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Transform your ideas into production-ready code with AI that codes
              like a senior engineer. Get started in seconds.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default SignIn;
