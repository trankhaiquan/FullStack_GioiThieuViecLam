from django.urls import path, include
from rest_framework import routers
from . import views
# from .views import MyTokenObtainPairView
from .views import JobViewSet, ApplicationViewSet, JobApplicationsViewSet
from .views import CurrentUserView

router = routers.DefaultRouter()
router.register(r'jobs', views.JobViewSet)
router.register(r'applications', views.ApplicationViewSet)  # Thêm URL pattern cho ApplicationViewSet
router.register(r'jobs/(?P<job_pk>\d+)/applications', views.JobApplicationsViewSet, basename='job-applications')
router.register(r'employers', views.EmployerViewSet)
router.register(r'applicants', views.ApplicantViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'ratings', views.RatingViewSet)

urlpatterns = [
    path('users/me/', CurrentUserView.as_view(), name='current_user'),
    path('', include(router.urls)),

    path('applicants/search/', views.ApplicantSearchView.as_view(), name='applicant-search')
    # path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
]
