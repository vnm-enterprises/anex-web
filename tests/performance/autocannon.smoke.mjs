import autocannon from "autocannon";

const target = process.env.PERF_TARGET || "http://localhost:3000/api/health";

const instance = autocannon({
  url: target,
  connections: Number(process.env.PERF_CONNECTIONS || 20),
  duration: Number(process.env.PERF_DURATION || 20),
  pipelining: 1,
  method: "GET",
  headers: {
    accept: "application/json",
  },
});

autocannon.track(instance, { renderProgressBar: true });

instance.on("done", (result) => {
  const avgLatency = result.latency.average;
  const rps = result.requests.average;

  if (avgLatency > 300 || rps < 50) {
    console.error("Performance smoke check failed", { avgLatency, rps });
    process.exit(1);
  }

  process.exit(0);
});
