# Kubernetes Security Policies
# Open Policy Agent (OPA) policies for Kubernetes manifest validation
# Use with conftest: conftest test infra/k8s/*.yaml --policy policies/

package main

import future.keywords.if
import future.keywords.in

# Deny containers running as root user
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    container.securityContext.runAsUser == 0
    msg := "Container must not run as root user (runAsUser: 0)"
}

# Require non-root user to be specified
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.securityContext.runAsUser
    msg := "Container must specify runAsUser (non-root user required)"
}

# Require resource limits
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.resources.limits
    msg := "Container must specify resource limits"
}

# Require resource requests
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.resources.requests
    msg := "Container must specify resource requests"
}

# Deny privileged containers
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    container.securityContext.privileged == true
    msg := "Container must not run in privileged mode"
}

# Require read-only root filesystem
warn[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.securityContext.readOnlyRootFilesystem
    msg := "Consider using read-only root filesystem for enhanced security"
}

# Deny containers with ALL capabilities
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    container.securityContext.capabilities.add[_] == "ALL"
    msg := "Container must not have ALL capabilities"
}

# Require image pull policy
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.imagePullPolicy
    msg := "Container must specify imagePullPolicy"
}

# Require image tag (not 'latest')
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    endswith(container.image, ":latest")
    msg := "Container image must not use 'latest' tag (use specific version)"
}

# Require liveness probe
warn[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.livenessProbe
    msg := "Consider adding liveness probe for container health checks"
}

# Require readiness probe
warn[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.readinessProbe
    msg := "Consider adding readiness probe for graceful startup"
}

