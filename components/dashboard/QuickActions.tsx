import { MessageCircle, Home } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <ActionCard
        icon={<Home />}
        title="My Properties"
        description="View and manage your ads"
      />
      <ActionCard
        icon={<MessageCircle />}
        title="Messages"
        description="You have new inquiries"
        highlight
      />
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer
      ${
        highlight
          ? "border-primary bg-primary/5"
          : "border-gray-200 dark:border-gray-800"
      }`}
    >
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
