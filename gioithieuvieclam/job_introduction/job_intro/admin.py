from django.contrib import admin
from django.utils.html import format_html
from django.db import models
from ckeditor.widgets import CKEditorWidget
from django.utils.safestring import mark_safe

from .models import User, Profile, Employer, Applicant, Job, Application, Rating


# Custom UserAdmin
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'is_staff']
    list_filter = ['role', 'is_staff']


# EmployerAdmin
class EmployerAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'website', 'is_approved', 'avatar_tag']
    list_filter = ['is_approved']
    actions = ['approve_employers']

    def approve_employers(self, request, queryset):
        queryset.update(is_approved=True)

    approve_employers.short_description = "Phê duyệt nhà tuyển dụng"

    def avatar_tag(self, obj):
        if obj.profile.avatar:
            return format_html('<img src="{}" style="width: 50px; height:auto;" />'.format(obj.profile.avatar.url))
        else:
            return 'No avatar'


# ApplicantAdmin
class ApplicantAdmin(admin.ModelAdmin):
    list_display = ('get_full_name', 'cv', 'skills', 'experience', 'avatar', 'avatar_tag')

    def get_full_name(self, obj):
        if obj.profile:
            return obj.profile.full_name
        else:
            return "Applicant without profile"

    def avatar_tag(self, obj):
        if obj.profile.avatar:
            return format_html('<img src="{}" style="width: 50px; height:auto;" />'.format(obj.profile.avatar.url))
        else:
            return 'No avatar'

    avatar_tag.short_description = 'Avatar'


# JobAdmin
class JobAdmin(admin.ModelAdmin):
    list_display = ('employer', 'title', 'created_at', 'job_type', 'description_preview')
    list_filter = ('job_type',)

    def get_job_type(self, obj):
        return obj.get_job_type_display()  # Lấy giá trị hiển thị của job_type

    get_job_type.short_description = 'Loại công việc'  # Đặt tên cho cột trong admin

    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget},
    }

    def description_preview(self, obj):
        if obj.description:
            return format_html(mark_safe(obj.description[:100] + "..."))
        return ""

    description_preview.short_description = 'Mô tả (xem trước)'


# ApplicationAdmin
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['applicant', 'job', 'status']
    list_filter = ['status']


# RatingAdmin
class RatingAdmin(admin.ModelAdmin):
    list_display = ['applicant', 'employer', 'rating', 'comment']


# Đăng ký models với Admin
admin.site.register(User, UserAdmin)
admin.site.register(Employer, EmployerAdmin)
admin.site.register(Applicant, ApplicantAdmin)
admin.site.register(Job, JobAdmin)
admin.site.register(Application, ApplicationAdmin)
admin.site.register(Rating, RatingAdmin)
admin.site.register(Profile)
