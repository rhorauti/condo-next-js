import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FaBeer } from 'react-icons/fa';

export const metadata = {
  title: 'App Router with shadcn/ui',
};

export default function Page() {
  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Welcome to shadcn/ui!</h1>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaBeer className="text-2xl text-amber-500" />
            My Next.js App
          </CardTitle>
          <CardDescription>
            This is a demonstration of shadcn/ui components with Tailwind CSS.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full">Primary Button</Button>
          <Button variant="outline" className="w-full">
            Outline Button
          </Button>
          <Button variant="secondary" className="w-full">
            Secondary Button
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
