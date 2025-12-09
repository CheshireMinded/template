import { Registry, Counter, Histogram, Gauge } from "prom-client";

/**
 * Prometheus metrics registry and collectors
 * 
 * This module provides metrics collection for:
 * - HTTP request counts and durations
 * - Error rates
 * - Active connections
 * - Database query performance
 * 
 * Metrics are exposed at /metrics endpoint for Prometheus scraping
 */
export const register = new Registry();

// HTTP Metrics
export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

export const httpRequestTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"]
});

export const httpErrorsTotal = new Counter({
  name: "http_errors_total",
  help: "Total number of HTTP errors",
  labelNames: ["method", "route", "status_code", "error_code"]
});

// Database Metrics
export const dbQueryDuration = new Histogram({
  name: "db_query_duration_seconds",
  help: "Duration of database queries in seconds",
  labelNames: ["operation", "table"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2]
});

export const dbConnectionsActive = new Gauge({
  name: "db_connections_active",
  help: "Number of active database connections"
});

// Business Metrics
export const todosCreated = new Counter({
  name: "todos_created_total",
  help: "Total number of todos created"
});

export const usersRegistered = new Counter({
  name: "users_registered_total",
  help: "Total number of users registered"
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(httpErrorsTotal);
register.registerMetric(dbQueryDuration);
register.registerMetric(dbConnectionsActive);
register.registerMetric(todosCreated);
register.registerMetric(usersRegistered);

/**
 * Get metrics in Prometheus format
 */
export function getMetrics(): Promise<string> {
  return register.metrics();
}

