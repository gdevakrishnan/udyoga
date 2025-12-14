from rest_framework.permissions import BasePermission
import requests
import os

class BaseRolePermission(BasePermission):
    role = None
    auth_url = os.getenv("AUTH_URL")

    def has_permission(self, request, view):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
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
                return False

            role = data.get("role")
            if not role:
                return False
            
            user_role = role

            return role == user_role

        except requests.RequestException:
            return False
        except ValueError:
            return False


class IsCandidate(BaseRolePermission):
    role = "candidate"


class IsRecruiter(BaseRolePermission):
    role = "recruiter"
