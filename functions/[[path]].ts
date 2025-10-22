export const onRequest: PagesFunction = async ({ request }) => {
  const incomingUrl = new URL(request.url);

  // Rewrite any request beginning with /fortune to root by stripping the prefix
  if (incomingUrl.pathname === "/fortune") {
    incomingUrl.pathname = "/";
  } else if (incomingUrl.pathname.startsWith("/fortune/")) {
    incomingUrl.pathname = incomingUrl.pathname.replace(/^\/fortune/, "");
  }

  return fetch(new Request(incomingUrl.toString(), request));
};


