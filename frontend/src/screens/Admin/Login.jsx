import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../../shared/api.js";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "../Lawyer/ui/alert.jsx";
import { Button } from "../Lawyer/ui/button.jsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../Lawyer/ui/card.jsx";
import { Checkbox } from "../Lawyer/ui/checkbox.jsx";
import { Input } from "../Lawyer/ui/input.jsx";
import { Label } from "../Lawyer/ui/label.jsx";

// Text color for inline validation errors
const ERROR_TEXT_CLASS =
  "text-sm font-medium text-red-600 dark:text-red-500 mt-1";

export default function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin@123");

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // navigate is stable from react-router-dom, so we can safely omit it

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    setValidationErrors({});

    let errors = {};
    let isValid = true;

    if (!email.trim()) {
      errors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (!isValid) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      try { localStorage.setItem("userType", res?.data?.admin?.role || "admin"); } catch (_) {}
      try { localStorage.setItem("role", res?.data?.admin?.role || "admin"); } catch (_) {}
      setAuthToken(res.data.token);
      navigate("/admin");
    } catch (e) {
      setServerError(
        e?.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md border-border bg-card text-card-foreground shadow">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Use your admin credentials to sign in
          </CardDescription>
        </CardHeader>

        <CardContent>
          {serverError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="size-4" aria-hidden="true" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={!!validationErrors.email}
                aria-describedby={
                  validationErrors.email ? "email-error" : undefined
                }
              />
              {validationErrors.email && (
                <p id="email-error" className={ERROR_TEXT_CLASS}>
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-invalid={!!validationErrors.password}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
              {validationErrors.password && (
                <p id="password-error" className={ERROR_TEXT_CLASS}>
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(Boolean(v))}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground"
                >
                  Remember me
                </Label>
              </div>

              <Button
                type="button"
                variant="link"
                className="px-0 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => console.log("[v0] Forgot password clicked")}
              >
                Forgot password?
              </Button>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            {serverError ? (
              <p id="form-error" className="sr-only">
                {serverError}
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
