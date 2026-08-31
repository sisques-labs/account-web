import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    defaultValue: { control: "text" },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList variant="line">
        <TabsTrigger value="tab1">Overview</TabsTrigger>
        <TabsTrigger value="tab2">Activity</TabsTrigger>
        <TabsTrigger value="tab3">Settings</TabsTrigger>
        <TabsTrigger value="tab4">Members</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm text-muted-foreground pt-2">Overview content</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm text-muted-foreground pt-2">Activity content</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm text-muted-foreground pt-2">Settings content</p>
      </TabsContent>
      <TabsContent value="tab4">
        <p className="text-sm text-muted-foreground pt-2">Members content</p>
      </TabsContent>
    </Tabs>
  ),
};

export const Pill: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList variant="pill">
        <TabsTrigger value="tab1" variant="pill">Overview</TabsTrigger>
        <TabsTrigger value="tab2" variant="pill">Activity</TabsTrigger>
        <TabsTrigger value="tab3" variant="pill">Settings</TabsTrigger>
        <TabsTrigger value="tab4" variant="pill">Members</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm text-muted-foreground pt-2">Overview content</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm text-muted-foreground pt-2">Activity content</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm text-muted-foreground pt-2">Settings content</p>
      </TabsContent>
      <TabsContent value="tab4">
        <p className="text-sm text-muted-foreground pt-2">Members content</p>
      </TabsContent>
    </Tabs>
  ),
};

export const MultipleTabsLine: Story = {
  render: () => (
    <div className="w-96">
      <Tabs defaultValue="plants">
        <TabsList variant="line">
          <TabsTrigger value="plants">Plants</TabsTrigger>
          <TabsTrigger value="spaces">Spaces</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="plants">
          <p className="text-sm text-muted-foreground pt-2">Plant list goes here</p>
        </TabsContent>
        <TabsContent value="spaces">
          <p className="text-sm text-muted-foreground pt-2">Spaces list goes here</p>
        </TabsContent>
        <TabsContent value="tasks">
          <p className="text-sm text-muted-foreground pt-2">Tasks list goes here</p>
        </TabsContent>
        <TabsContent value="reports">
          <p className="text-sm text-muted-foreground pt-2">Reports go here</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
};
