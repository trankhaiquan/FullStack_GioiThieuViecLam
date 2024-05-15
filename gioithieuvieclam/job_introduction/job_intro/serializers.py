from rest_framework import serializers
from .models import Job, Employer, Applicant, Application, Rating
from django.contrib.auth import get_user_model
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'avatar') # Giới hạn trường dữ liệu

class EmployerSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = Employer
        fields = ('id', 'company_name', 'company_description', 'website', 'is_approved', 'avatar_url')

    def get_avatar_url(self, obj):
        if obj.avatar:
            return obj.avatar.url
        return None

class JobSerializer(serializers.ModelSerializer):
    employer = EmployerSerializer(read_only=True) # Sử dụng EmployerSerializer
    created_at = serializers.DateTimeField(format="%d/%m/%Y")

    class Meta:
        model = Job
        fields = ('id', 'employer', 'title', 'description', 'requirements', 'salary', 'location', 'created_at', 'job_type') # Giới hạn trường

class ApplicantSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    full_name = serializers.CharField(source='profile.full_name')

    class Meta:
        model = Applicant
        fields = ('id', 'full_name', 'cv', 'skills', 'experience', 'avatar_url')

    def get_avatar_url(self, obj):
        if obj.avatar:
            return obj.avatar.url
        return None

class ApplicationSerializer(serializers.ModelSerializer):
    applicant = ApplicantSerializer(read_only=True) # Sử dụng ApplicantSerializer
    job = JobSerializer(read_only=True) # Sử dụng JobSerializer

    class Meta:
        model = Application
        fields = ('id', 'applicant', 'job', 'cover_letter', 'status') # Giới hạn trường

class RatingSerializer(serializers.ModelSerializer):
    applicant = ApplicantSerializer(read_only=True) # Sử dụng ApplicantSerializer
    employer = EmployerSerializer(read_only=True) # Sử dụng EmployerSerializer

    class Meta:
        model = Rating
        fields = ('id', 'applicant', 'employer', 'rating', 'comment') # Giới hạn trường