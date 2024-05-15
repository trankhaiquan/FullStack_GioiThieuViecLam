from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination

from .filters import JobFilter
from .models import Job, Application
from .permissions import IsEmployerOrReadOnly
from .serializers import JobSerializer, ApplicationSerializer

from django.http import JsonResponse

from rest_framework import viewsets, permissions
from .models import Job
from .serializers import JobSerializer

from django.contrib.auth import get_user_model
from .serializers import UserSerializer

from .models import Employer
from .serializers import EmployerSerializer


from .models import Rating
from .serializers import RatingSerializer

from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, OAuth2Authentication

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .models import Applicant
from .serializers import ApplicantSerializer


def home(request):
    data = {'message': 'Chào mừng đến với API giới thiệu việc làm!'}
    return JsonResponse(data)


class JobPagination(PageNumberPagination):
    page_size = 20


class ApplicantSearchView(generics.ListAPIView):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search_term = self.request.query_params.get('search', None)
        if search_term:
            # Thực hiện logic tìm kiếm dựa trên search_term, ví dụ:
            queryset = queryset.filter(profile__full_name__icontains=search_term)
        return queryset

class CurrentUserView(APIView):
    authentication_classes = [OAuth2Authentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]


class EmployerViewSet(viewsets.ModelViewSet):
    queryset = Employer.objects.all()
    serializer_class = EmployerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsEmployerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    pagination_class = JobPagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'salary']
    permission_classes = [permissions.IsAuthenticated, TokenHasReadWriteScope]
    required_scopes = ['read', 'write']


def has_permission(self, request, view):
    # Kiểm tra quyền cho các hành động khác nhau
    if view.action == 'create':
        return request.user.has_perm('job_intro.add_job')
    elif view.action == 'update' or view.action == 'partial_update':
        return request.user.has_perm('job_intro.change_job')
    elif view.action == 'destroy':
        return request.user.has_perm('job_intro.delete_job')
    return super().has_permission(request, view)


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user.applicant)


class JobApplicationsViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        job_pk = self.kwargs.get('job_pk')
        if job_pk:
            return Application.objects.filter(job_id=job_pk)
        else:
            return Application.objects.none()
class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user.applicant)
