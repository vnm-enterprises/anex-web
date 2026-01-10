"use client";

export default function PricingSection() {
  return (
    <section className="bg-surface-light dark:bg-surface-dark p-6 sm:p-8 rounded-2xl border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded bg-primary/10 text-primary">
          <span className="material-symbols-outlined">payments</span>
        </div>
        <h2 className="text-xl font-bold">Pricing</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Rent */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Monthly Rent (LKR)
          </label>
          <input
            type="number"
            className="w-full px-4 py-3 rounded-lg border font-bold text-lg"
            placeholder="45,000"
          />
        </div>

        {/* Advance */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Key Money / Advance (months)
          </label>
          <input
            type="number"
            className="w-full px-4 py-3 rounded-lg border"
            placeholder="6"
          />
        </div>
      </div>
    </section>
  );
}
