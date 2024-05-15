import django_filters
from .models import Job

class JobFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(lookup_expr='iexact')  # Lọc theo category (không phân biệt chữ hoa/thường)
    job_type = django_filters.ChoiceFilter(choices=Job.JOB_TYPE_CHOICES)  # Lọc theo job_type

    class Meta:
        model = Job
        fields = ['category', 'job_type', 'location']