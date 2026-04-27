{{/*
Expand the name of the chart.
*/}}
{{- define "freeshop.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "freeshop.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "freeshop.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "freeshop.labels" -}}
helm.sh/chart: {{ include "freeshop.chart" . }}
{{ include "freeshop.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels - used to select pods by service
*/}}
{{- define "freeshop.selectorLabels" -}}
app: {{ .Values.serviceName | quote }}
release: {{ .Release.Name }}
{{- end }}

{{/*
Get service port from configuration
*/}}
{{- define "freeshop.servicePort" -}}
{{- $serviceName := .Values.serviceName }}
{{- if and $serviceName (hasKey .Values.services.ports $serviceName) }}
{{- index .Values.services.ports $serviceName }}
{{- else }}
3000
{{- end }}
{{- end }}

{{/*
Get image name
*/}}
{{- define "freeshop.image" -}}
{{- $registry := .Values.image.registry }}
{{- $owner := .Values.image.owner }}
{{- $service := .Values.serviceName }}
{{- $tag := .Values.image.tag | default "latest" }}
{{- printf "%s/%s/freeshop-%s:%s" $registry $owner $service $tag }}
{{- end }}

{{/*
Check if service has database (database services: auth, user, product, order, payment, inventory, vendor, notification, analytics)
*/}}
{{- define "freeshop.hasDatabase" -}}
{{- if or (eq .Values.serviceName "auth-service") (eq .Values.serviceName "user-service") (eq .Values.serviceName "product-service") (eq .Values.serviceName "order-service") (eq .Values.serviceName "payment-service") (eq .Values.serviceName "inventory-service") (eq .Values.serviceName "vendor-service") (eq .Values.serviceName "notification-service") (eq .Values.serviceName "analytics-service") }}
true
{{- end }}
{{- end }}
