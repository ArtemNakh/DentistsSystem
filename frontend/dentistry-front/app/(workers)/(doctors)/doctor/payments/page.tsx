"use client";

import { useState } from "react";
import FilterPanelPayments, { PaymentFilters } from "./components/FilterPanel";
import PaymentsList from "./components/PaymentsList";

interface PaymentReceptionProps {}

export default function PaymentReception({}: PaymentReceptionProps) {
  const [filters, setFilters] = useState<PaymentFilters>({
    amount: 0,
    status_paid: null,
    method_pay: null,
    status_appointment: null,
    date_begin: "",
    date_end: "",
  });
  return (
    <>
      <div>
        {/* filtres */}
        <div>
          <FilterPanelPayments filters={filters} setFilters={setFilters} />
        </div>

        {/* content */}
        <PaymentsList filters={filters} />
      </div>
    </>
  );
}
