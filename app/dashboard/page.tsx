import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import ListingsSection from "@/components/dashboard/ListingsSection";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardHeader />
        <AnalyticsSection />
        <ListingsSection />
      </div>
    </DashboardLayout>
  );
}
