import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ListingsSection from "@/components/dashboard/ListingsSection";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardHeader />
        <ListingsSection />
      </div>
    </DashboardLayout>
  );
}
