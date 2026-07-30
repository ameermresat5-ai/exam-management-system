# Google Cloud Terraform Bootstrap

This Terraform root module creates the private Cloud Storage bucket used by
the project Terraform backends.

## Security configuration

- Uniform bucket-level access
- Public access prevention
- Object versioning
- `force_destroy = false`
- Terraform `prevent_destroy`
- Soft delete disabled because object versioning protects state history

## State prefixes

- `bootstrap/` — state for this bootstrap module
- `gcp-gke/production/` — state for the active Google Cloud infrastructure

The actual `terraform.tfvars` file and all Terraform state files are excluded
from Git.
