import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/minha-jornada/:path*",
    "/grupos/:path*",
    "/oracao/:path*",
    "/admin/:path*",
    "/leader/:path*",
  ],
};
