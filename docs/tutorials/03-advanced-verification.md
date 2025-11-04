# Tutorial 3: Advanced Verification

This tutorial covers advanced verification scenarios using the Porkate-Valid8 framework, including multi-step flows, face matching, and fallback strategies.

## 1. Multi-Step Verification Flows

You can chain multiple verification steps for higher assurance:

```typescript
const ninResult = await ninService.verifyNIN({ nin, firstName, lastName });
if (ninResult.success) {
  // Proceed to face match
  const faceResult = await ninService.verifyNINWithFace({ nin, image });
  if (faceResult.success) {
    // Verification complete
  }
}
```

## 2. Using Fallback Adapters

Enable fallback in your manager config to automatically try secondary adapters:

```typescript
const manager = new VerificationManager({
  defaultAdapter: 'identitypass',
  enableFallback: true,
  adapters: [
    { name: 'identitypass', enabled: true, priority: 1, config: {...} },
    { name: 'youverify', enabled: true, priority: 2, config: {...} },
  ],
});

const adapter = manager.getAdapterWithFallback('identitypass');
```

## 3. Custom Event Handling

Track advanced events for auditing and analytics:

```typescript
eventEmitter.on('verification:completed', (data) => {
  // Log or send to analytics
});
```

## 4. Error Handling and Retries

Implement retries for transient errors:

```typescript
try {
  const result = await adapter.verifyNIN({ nin, firstName, lastName });
} catch (error) {
  // Retry or escalate
}
```

## 5. Combining Multiple Services

You can combine results from different services for robust verification:

```typescript
const ninResult = await ninService.verifyNIN({ ... });
const bvnResult = await bvnService.verifyBVN({ ... });
if (ninResult.success && bvnResult.success) {
  // Stronger confidence
}
```

---

For more advanced patterns, see the API docs and architecture guide.