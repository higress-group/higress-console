{{/*
Expand the name of the chart.
*/}}
{{- define "higress-console.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "higress-console.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else if contains "higress" .Release.Name }}
{{- printf "%s-console" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "higress-console.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "higress-console.labels" -}}
helm.sh/chart: {{ include "higress-console.chart" . }}
{{ include "higress-console.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "higress-console.selectorLabels" -}}
app.kubernetes.io/name: {{ include "higress-console.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Admin Password
*/}}
{{- define "higress-console.adminPassword" -}}
app.kubernetes.io/name: {{ include "higress-console.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create a default fully qualified app name for Grafana.
*/}}
{{- define "higress-console-grafana.fullname" -}}
{{- $consoleFullName := include "higress-console.fullname" . }}
{{- printf "%s-grafana" ($consoleFullName | trunc 55) }}
{{- end }}

{{/*
Create a default fully qualified app name for Prometheus.
*/}}
{{- define "higress-console-prometheus.fullname" -}}
{{- $consoleFullName := include "higress-console.fullname" . }}
{{- printf "%s-prometheus" ($consoleFullName | trunc 52) }}
{{- end }}
