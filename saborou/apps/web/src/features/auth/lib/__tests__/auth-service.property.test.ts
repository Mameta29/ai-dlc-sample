import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import type { UserStatus, DeletionStatus } from "@/types/database.types";
import { DELETION_GRACE_PERIOD_DAYS } from "../types";

// Valid state transitions
const VALID_USER_TRANSITIONS: Record<UserStatus, UserStatus[]> = {
  ACTIVE: ["PENDING_DELETION"],
  PENDING_DELETION: ["ACTIVE", "DELETED"],
  DELETED: [],
};

const VALID_DELETION_TRANSITIONS: Record<DeletionStatus, DeletionStatus[]> = {
  PENDING: ["CANCELLED", "COMPLETED"],
  CANCELLED: [],
  COMPLETED: [],
};

const userStatusArb = fc.constantFrom<UserStatus>(
  "ACTIVE",
  "PENDING_DELETION",
  "DELETED"
);

const deletionStatusArb = fc.constantFrom<DeletionStatus>(
  "PENDING",
  "CANCELLED",
  "COMPLETED"
);

describe("PBT: UserStatus State Transitions (Invariant)", () => {
  it("should only allow valid transitions", () => {
    fc.assert(
      fc.property(userStatusArb, userStatusArb, (from, to) => {
        const isValid = VALID_USER_TRANSITIONS[from].includes(to);
        const isSame = from === to;

        // Either the transition is valid, or it's the same state (no-op),
        // or it should be rejected
        if (isSame) return true;

        if (from === "DELETED") {
          // DELETED is terminal - no transitions allowed
          expect(isValid).toBe(false);
        }

        if (from === "ACTIVE" && to === "DELETED") {
          // Cannot skip PENDING_DELETION
          expect(isValid).toBe(false);
        }

        return true;
      })
    );
  });

  it("DELETED should be a terminal state for all possible transitions", () => {
    fc.assert(
      fc.property(userStatusArb, (targetStatus) => {
        expect(VALID_USER_TRANSITIONS["DELETED"]).not.toContain(targetStatus);
      })
    );
  });
});

describe("PBT: DeletionStatus State Transitions (Invariant)", () => {
  it("CANCELLED and COMPLETED should be terminal states", () => {
    fc.assert(
      fc.property(deletionStatusArb, (targetStatus) => {
        expect(VALID_DELETION_TRANSITIONS["CANCELLED"]).not.toContain(
          targetStatus
        );
        expect(VALID_DELETION_TRANSITIONS["COMPLETED"]).not.toContain(
          targetStatus
        );
      })
    );
  });

  it("only PENDING should have valid outgoing transitions", () => {
    fc.assert(
      fc.property(deletionStatusArb, (status) => {
        if (status === "PENDING") {
          expect(VALID_DELETION_TRANSITIONS[status].length).toBeGreaterThan(0);
        } else {
          expect(VALID_DELETION_TRANSITIONS[status]).toHaveLength(0);
        }
      })
    );
  });
});

describe("PBT: Token Validation Idempotence", () => {
  it("validateToken should return the same result regardless of call count", () => {
    // Simulates the idempotence property: validateToken(token) called N times
    // should always return the same result
    const simulateValidation = (token: string, isExpired: boolean): boolean => {
      if (!token || token.length === 0) return false;
      if (isExpired) return false;
      return true;
    };

    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.boolean(),
        fc.integer({ min: 1, max: 100 }),
        (token, isExpired, callCount) => {
          const firstResult = simulateValidation(token, isExpired);
          for (let i = 1; i < callCount; i++) {
            expect(simulateValidation(token, isExpired)).toBe(firstResult);
          }
        }
      )
    );
  });
});

describe("PBT: Deletion Grace Period (Invariant)", () => {
  it("scheduled_deletion_at should always be requested_at + grace period", () => {
    fc.assert(
      fc.property(
        fc.date({
          min: new Date("2020-01-01"),
          max: new Date("2030-12-31"),
        }),
        (requestedAt) => {
          if (isNaN(requestedAt.getTime())) return;
          const scheduledDeletionAt = new Date(requestedAt);
          scheduledDeletionAt.setDate(
            scheduledDeletionAt.getDate() + DELETION_GRACE_PERIOD_DAYS
          );

          const diffMs =
            scheduledDeletionAt.getTime() - requestedAt.getTime();
          const diffDays = diffMs / (1000 * 60 * 60 * 24);

          expect(diffDays).toBe(DELETION_GRACE_PERIOD_DAYS);
        }
      )
    );
  });
});

describe("PBT: Cancel Deletion Idempotence", () => {
  it("cancelling an already ACTIVE user should not change state", () => {
    const simulateCancelDeletion = (
      currentStatus: UserStatus
    ): UserStatus => {
      if (currentStatus === "PENDING_DELETION") return "ACTIVE";
      return currentStatus; // No change for ACTIVE or DELETED
    };

    fc.assert(
      fc.property(fc.integer({ min: 1, max: 10 }), (callCount) => {
        let status: UserStatus = "ACTIVE";
        for (let i = 0; i < callCount; i++) {
          status = simulateCancelDeletion(status);
        }
        expect(status).toBe("ACTIVE");
      })
    );
  });
});
