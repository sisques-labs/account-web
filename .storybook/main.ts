import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-themes",
    "@storybook/addon-docs",
  ],
  staticDirs: ["../public"],
  docs: {
    autodocs: "tag",
  },
};

export default config;
