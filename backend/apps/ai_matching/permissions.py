import os
import logging
import requests
from rest_framework.permissions import BasePermission

logger = logging.getLogger(__name__)


class BaseRolePermission(BasePermission):
    """
    Base permission class for role-based access control.
    Subclasses must define `role`.
    """
    role = None
    auth_url = os.getenv("AUTH_URL")

    def has_permission(self, request, view):
        # Ensure role is defined
        if not self.role:
            logger.error("Role not defined in permission class")
            return False

        # Get Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            logger.warning("Authorization header missing")
            return False

        if not self.auth_url:
            logger.error("AUTH_URL not configured")
            return False

        try:
            response = requests.get(
                self.auth_url,
                headers={"Authorization": auth_header},
                timeout=5
            )

            response.raise_for_status()

            user_data = response.json()

            data = user_data.get("data")
            if not data:
                logger.warning("Invalid auth response: 'data' missing")
                return False

            user_role = data.get("role")
            if not user_role:
                logger.warning("User role missing in auth response")
                return False

            # Normalize roles for safety
            user_role = user_role.lower()
            required_role = self.role.lower()

            logger.info(
                f"Permission check → Required: {required_role}, User: {user_role}"
            )

            return user_role == required_role

        except requests.Timeout:
            logger.error("Auth service timeout")
            return False

        except requests.RequestException as e:
            logger.error(f"Auth service error: {str(e)}")
            return False

        except ValueError:
            logger.error("Invalid JSON response from auth service")
            return False


# -----------------------------
# Role-specific permissions
# -----------------------------

class IsCandidate(BaseRolePermission):
    role = "candidate"


class IsRecruiter(BaseRolePermission):
    role = "recruiter"
