from rest_framework.permissions import BasePermission


class IsCandidate(BasePermission):
    """
    Allows access only to authenticated users with role = candidate
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == "candidate"
        )
