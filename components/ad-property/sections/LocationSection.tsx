"use client";

import MapPicker from "../MapPicker";

export default function LocationSection() {
  return (
    <section className="bg-surface-light dark:bg-surface-dark p-6 sm:p-8 rounded-2xl border">
      <h2 className="text-xl font-bold mb-6">Location</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <select className="input">
          <option>Colombo</option>
          <option>Gampaha</option>
          <option>Kandy</option>
        </select>
        <input className="input" placeholder="City / Town" />
      </div>

      <MapPicker />
    </section>
  );
}
