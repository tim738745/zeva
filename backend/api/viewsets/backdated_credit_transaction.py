from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.serializers import BaseSerializer
from rest_framework.response import Response
from rest_framework import status
from api.models.backdated_credit_transaction import BackdatedCreditTransaction
from api.services.credit_transaction import (
    get_backdated_transactions_for_credit_balance,
    get_backdated_transactions_for_new_supplemental,
    get_backdated_transactions_for_supplemental,
)
from api.serializers.backdated_credit_transaction import (
    BackdatedCreditTransactionContextSerializer,
)
from api.serializers.credit_transaction import (
    CreditTransactionBalanceItemSerializer,
    CreditTransactionComplianceReportSerializer,
)
from api.utilities.credit_transaction import access_forbidden
from api.services.organization import get_organization
from api.services.model_year_report import get_report, get_supplemental_report


class BackdatedCreditTransactionViewSet(
    viewsets.GenericViewSet,
):
    permission_classes = [AllowAny]
    queryset = BackdatedCreditTransaction.objects.none()
    serializer = BaseSerializer()

    @action(detail=False, methods=["get"])
    def credit_balance(self, request):
        organization_id = request.query_params.get("organization")
        organization = get_organization(organization_id)
        if access_forbidden(request.user, organization):
            return Response(status=status.HTTP_403_FORBIDDEN)
        select_related = [
            "credit_class",
            "credit_to",
            "debit_from",
            "model_year",
            "weight_class",
        ]
        transactions = get_backdated_transactions_for_credit_balance(
            organization, *select_related
        )
        serializer_context = {
            "credit_transaction_serializer": CreditTransactionBalanceItemSerializer,
            "organization": organization,
            "contains_related": True,
            "get_signed_value": True,
        }
        serializer = BackdatedCreditTransactionContextSerializer(
            transactions, many=True, context=serializer_context
        )
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def supplemental(self, request):
        myr_id = request.query_params.get("model_year_report")
        supp_id = request.query_params.get("supplemental_id")
        report = get_report(myr_id, "organization", "model_year")
        organization = report.organization
        if access_forbidden(request.user, organization):
            return Response(status=status.HTTP_403_FORBIDDEN)
        select_related = [
            "credit_class",
            "credit_to",
            "debit_from",
            "model_year",
            "transaction_type",
        ]
        if not supp_id:
            transactions = get_backdated_transactions_for_new_supplemental(
                report, *select_related
            )
        else:
            supp = get_supplemental_report(
                supp_id,
                "model_year_report__organization",
                "model_year_report__model_year",
            )
            transactions = get_backdated_transactions_for_supplemental(
                supp, *select_related
            )
        serializer_context = {
            "credit_transaction_serializer": CreditTransactionComplianceReportSerializer,
            "organization": organization,
            "contains_related": True,
            "get_signed_value": False,
        }
        serializer = BackdatedCreditTransactionContextSerializer(
            transactions, many=True, context=serializer_context
        )
        return Response(serializer.data)
