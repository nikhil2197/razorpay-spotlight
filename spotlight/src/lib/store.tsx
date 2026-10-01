"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MERCHANTS, OFFERINGS, ROSTER } from "@/data/seed";
import type { Merchant, SpotlightOffering, RosterRecord, AttendanceStatus } from "@/lib/types";

const STORAGE_KEY = "spotlight_state_v1";

type PersistedState = {
  merchantId: string | null;
  offerings: SpotlightOffering[];
  roster: RosterRecord[];
};

function loadState(): PersistedState {
  if (typeof window === "undefined") {
    return { merchantId: null, offerings: OFFERINGS, roster: ROSTER };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { merchantId: null, offerings: OFFERINGS, roster: ROSTER };
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed.offerings?.length) parsed.offerings = OFFERINGS;
    if (!parsed.roster) parsed.roster = ROSTER;
    return parsed;
  } catch {
    return { merchantId: null, offerings: OFFERINGS, roster: ROSTER };
  }
}

type SpotlightContextValue = {
  hydrated: boolean;
  merchant: Merchant | null;
  merchants: Merchant[];
  offerings: SpotlightOffering[];
  roster: RosterRecord[];
  selectMerchant: (merchantId: string) => void;
  upsertOffering: (offering: SpotlightOffering) => void;
  getOffering: (offeringId: string) => SpotlightOffering | undefined;
  rosterFor: (offeringId: string) => RosterRecord[];
  setAttendance: (bookingId: string, attendance: AttendanceStatus) => void;
  requestReview: (bookingId: string) => void;
  cancelAndRefundAll: (offeringId: string) => void;
  cancelBatchNextSession: (offeringId: string, batchId: string) => void;
  bookSlot: (offeringId: string, batchId: string | undefined, studentName: string, studentPhone: string) => RosterRecord;
};

const SpotlightContext = createContext<SpotlightContextValue | null>(null);

export function SpotlightProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [offerings, setOfferings] = useState<SpotlightOffering[]>(OFFERINGS);
  const [roster, setRoster] = useState<RosterRecord[]>(ROSTER);

  // Hydrating client-only state (localStorage isn't available during SSR) —
  // this one-time mount effect intentionally sets state synchronously.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const state = loadState();
    setMerchantId(state.merchantId);
    setOfferings(state.offerings);
    setRoster(state.roster);
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    const state: PersistedState = { merchantId, offerings, roster };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, merchantId, offerings, roster]);

  const selectMerchant = useCallback((id: string) => setMerchantId(id), []);

  const upsertOffering = useCallback((offering: SpotlightOffering) => {
    setOfferings((prev) => {
      const idx = prev.findIndex((o) => o.offeringId === offering.offeringId);
      if (idx === -1) return [...prev, offering];
      const next = [...prev];
      next[idx] = offering;
      return next;
    });
  }, []);

  const getOffering = useCallback(
    (offeringId: string) => offerings.find((o) => o.offeringId === offeringId),
    [offerings]
  );

  const rosterFor = useCallback(
    (offeringId: string) => roster.filter((r) => r.offeringId === offeringId),
    [roster]
  );

  const setAttendance = useCallback((bookingId: string, attendance: AttendanceStatus) => {
    setRoster((prev) => prev.map((r) => (r.bookingId === bookingId ? { ...r, operations: { ...r.operations, attendance } } : r)));
  }, []);

  const requestReview = useCallback((bookingId: string) => {
    setRoster((prev) =>
      prev.map((r) => (r.bookingId === bookingId ? { ...r, operations: { ...r.operations, reviewRequested: true } } : r))
    );
  }, []);

  const cancelAndRefundAll = useCallback((offeringId: string) => {
    setRoster((prev) =>
      prev.map((r) =>
        r.offeringId === offeringId
          ? {
              ...r,
              payment: { ...r.payment, status: "REFUNDED" as const },
              operations: { ...r.operations, bookingStatus: "CANCELED" as const },
            }
          : r
      )
    );
  }, []);

  /** Recurring batches cancel/refund only the next upcoming occurrence of one batch, not the whole offering. */
  const cancelBatchNextSession = useCallback((offeringId: string, batchId: string) => {
    setRoster((prev) =>
      prev.map((r) =>
        r.offeringId === offeringId && r.batchId === batchId
          ? {
              ...r,
              payment: { ...r.payment, status: "REFUNDED" as const },
              operations: { ...r.operations, bookingStatus: "CANCELED" as const },
            }
          : r
      )
    );
  }, []);

  const bookSlot = useCallback(
    (offeringId: string, batchId: string | undefined, studentName: string, studentPhone: string) => {
      const record: RosterRecord = {
        bookingId: `bk_${Math.floor(100000 + Math.random() * 899999)}`,
        offeringId,
        batchId,
        studentName,
        studentPhone,
        payment: { status: "PAID", method: "UPI", vpaApp: "GooglePay", paidAt: new Date().toISOString() },
        operations: { attendance: "UNMARKED", bookingStatus: "ATTENDING", renewalStatus: "NOT_APPLICABLE", reviewRequested: false },
      };
      setRoster((prev) => [...prev, record]);
      setOfferings((prev) =>
        prev.map((o) => {
          if (o.offeringId !== offeringId) return o;
          return {
            ...o,
            schedule: {
              ...o.schedule,
              batches: o.schedule.batches.map((b) => (b.id === batchId ? { ...b, filled: Math.min(b.capacity, b.filled + 1) } : b)),
            },
          };
        })
      );
      return record;
    },
    []
  );

  const merchant = useMemo(() => MERCHANTS.find((m) => m.merchantId === merchantId) ?? null, [merchantId]);

  const value: SpotlightContextValue = {
    hydrated,
    merchant,
    merchants: MERCHANTS,
    offerings,
    roster,
    selectMerchant,
    upsertOffering,
    getOffering,
    rosterFor,
    setAttendance,
    requestReview,
    cancelAndRefundAll,
    cancelBatchNextSession,
    bookSlot,
  };

  return <SpotlightContext.Provider value={value}>{children}</SpotlightContext.Provider>;
}

export function useSpotlight() {
  const ctx = useContext(SpotlightContext);
  if (!ctx) throw new Error("useSpotlight must be used within SpotlightProvider");
  return ctx;
}
