## Task 3 — Bug Fix

**The Bug:**

The loop runs one extra iteration. Arrays in JS are 0-indexed, so valid indexes are `0` to `length - 1`. When `i === callLogs.length`, `callLogs[i]` is `undefined`, and accessing `.duration_seconds` on it throws a TypeError.

```javascript
// buggy
for (let i = 0; i <= callLogs.length; i++) { ... }
//                 ^^ should be < not <=
```

**The Fix:**

```javascript
function calculateEarnings(callLogs) {
  let total = 0;
  for (let i = 0; i < callLogs.length; i++) {
    const minutes = callLogs[i].duration_seconds / 60;
    total += minutes * callLogs[i].rate;
  }
  return total.toFixed(2);
}
```

Just change `<=` to `<`. That's it.

---

## Task 4 — Short Answer Questions

### Q1: When a user makes a call to a creator, what backend events do you think happen in real-time?

From what I explored in the app, a call probably goes through something like this:

1. **Auth + balance check** — server verifies the user's token and checks if they have enough CS Coins or an active Pass before doing anything.

2. **WebSocket signaling** — both sides (caller and creator) are connected over WebSockets. The backend sends SDP offer/answer and ICE candidates to set up the WebRTC peer connection.

3. **Coin reservation** — coins aren't fully deducted upfront. I think the backend locks/reserves the amount and deducts per minute (or at call end) to avoid overcharging if the call drops early.

4. **Push notification to creator** — if the creator's app is backgrounded, the server sends a push (FCM/APNs) to wake their device so they can accept the call.

5. **Active session record** — a call session is created in the DB (or Redis) so the system knows the call is live and can track duration server-side, not rely on client-reported time.

---

### Q2: If the app has 500 concurrent calls at 10 PM, what backend bottlenecks could arise?

**Where it gets slow:**

- **DB writes during live calls** — if coins are being deducted every 60 seconds per call, that's 500 concurrent DB writes hitting the same `users` table. Row locking becomes a problem fast.

- **WebSocket connections** — 500 calls = ~1000 open WebSocket connections on the signaling server. One node will hit memory/CPU limits.

- **Call end spike** — if many calls end around the same time (e.g., after a 10-minute pass), there's a spike of simultaneous writes — coin deductions, call logs, transaction records all at once.

**How I'd handle it:**

- Use Redis for real-time coin tracking (atomic `DECRBY`). Write final balances to PostgreSQL only when the call ends — not mid-call.
- Run multiple WebSocket/signaling servers behind a load balancer with Redis Pub/Sub so any node can relay messages between callers and creators.
- Queue the call-end writes through something like BullMQ so the DB isn't hammered at the same second.

---

### Q3: How would you design a basic abuse/spam detection for voice calls?

A few things I'd look at:

- **Call drop patterns** — if someone initiates 10 calls in 2 minutes and hangs up within 5 seconds each time, that's flagged. Short-duration calls repeated quickly are a common signal for spam or harassment.

- **Rate limiting on call initiation** — cap how many calls a user can start per minute/hour. Store counters in Redis with a TTL (e.g., `call_attempts:user_001 = 5, expires in 60s`).

- **Creator-side reporting** — if a creator reports a caller, log it. After N reports from different creators, automatically trigger a review or temporary suspension.

- **Device/IP blacklist** — ban at the device fingerprint + IP level, not just user ID. Bad actors create new accounts but usually same device.

- **Trust score** — each account starts with a score. Uncompleted calls, reports, and charge disputes lower it. Below a threshold, require OTP re-verification before calling again.
