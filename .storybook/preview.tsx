import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import * as React from "react";
import "../app/globals.css";
import { withQueryClient } from "./decorators/with-query-client";

// Font variables. next/font does not run inside Storybook, so we inject
// the same CSS variable names the app exposes, each falling back to the matching
// Google font family name. Names MUST match app/layout.tsx exactly.
const FontVars = () => (
  <style>{`
    :root {
      --font-newsreader: "Newsreader", "Source Serif Pro", Georgia, serif;
      --font-dm-sans: "DM Sans", -apple-system, "Segoe UI", sans-serif;
      --font-caveat: "Caveat", "Bradley Hand", cursive;
      --font-jetbrains-mono: "JetBrains Mono", ui-monospace, monospace;
    }
  `}</style>
);

const preview: Preview = {
  decorators: [
    // Fresh QueryClient per story so any hook-backed component/screen renders
    // without crashing. Stories that need specific data override this with
    // their own withQueryClient(seed) decorator (nested providers shadow this
    // one for that story only).
    withQueryClient(),
    // Palette toggle — applies classes to <body>, matching runtime.
    withThemeByClassName({
      themes: {
        light: "",
        dark: "palette-dark",
        pastel: "palette-pastel",
      },
      defaultTheme: "light",
      parentSelector: "body",
    }),
    (Story) => (
      <>
        <FontVars />
        <Story />
      </>
    ),
  ],
  parameters: {
    // Backgrounds are driven by the palette (body bg from globals.css base layer),
    // so disable Storybook's own backgrounds addon to avoid conflicting surfaces.
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // The app is App Router only (app/). Without this, @storybook/nextjs falls
    // back to Pages Router mocks and any next/navigation hook (useRouter,
    // useSearchParams, usePathname) throws NextjsRouterMocksNotAvailable.
    nextjs: { appDirectory: true },
  },
};

export default preview;
