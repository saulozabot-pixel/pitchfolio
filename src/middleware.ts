import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Rotas públicas — qualquer um pode ver sem login
const isPublicRoute = createRouteMatcher([
  '/',                    // Landing / Dashboard
  '/templates',           // Galeria de templates
  '/templates/(.*)',      // Preview de cada template
  '/pricing',             // Página de preços
  '/u/(.*)',              // Portfólios públicos
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  // Admin e demais rotas protegidas: exige login
  // Verificação de permissão de admin é feita dentro da própria página/API
  if (isAdminRoute(req) || !isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
