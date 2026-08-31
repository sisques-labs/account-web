import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "../button/button";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: () => (
    <Card className="w-72">
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">This is a basic card with content only.</p>
      </CardContent>
    </Card>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Card className="w-72">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Card body with some descriptive content explaining the purpose of this card.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Confirm</Button>
      </CardFooter>
    </Card>
  ),
};
