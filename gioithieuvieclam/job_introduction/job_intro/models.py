
from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField


# Create your models here.


class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('employer', 'Nhà tuyển dụng'),
        ('applicant', 'Ứng viên'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    avatar = models.ImageField(upload_to='avatars/%Y/%m', blank=True)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='%(app_label)s_%(class)s_groups',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='%(app_label)s_%(class)s_permissions',
        blank=True,
    )


class BaseModel(models.Model):
    """
    BaseModel với các trường created_date, updated_date và active
    """
    created_date = models.DateField(auto_now_add=True)
    updated_date = models.DateField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True
        ordering = ['id']


class Profile(BaseModel):
    """
    Lưu trữ thông tin chung cho cả nhà tuyển dụng và ứng viên
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/%Y/%m')
    full_name = models.CharField(max_length=255)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.full_name  # Trả về tên đầy đủ
class Employer(BaseModel):  # Kế thừa BaseModel
    """
    Lưu trữ thông tin chi tiết của nhà tuyển dụng
    """
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, null=True)
    company_name = models.CharField(max_length=255)
    company_description = models.TextField()
    logo = models.ImageField(upload_to='logos/%Y/%m', blank=True)
    website = models.URLField(blank=True)
    is_approved = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to='avatars/', blank=True)

    def __str__(self):
        return self.company_name
class Applicant(BaseModel):  # Kế thừa BaseModel
    """
    Lưu trữ thông tin chi tiết của ứng viên
    """
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, null=True)
    cv = models.FileField(upload_to='cvs/', blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    skills = models.TextField(blank=True)
    experience = models.TextField(blank=True)

    def __str__(self):
        if self.profile:  # Kiểm tra xem profile có tồn tại hay không
            return self.profile.full_name  # Trả về tên đầy đủ từ profile
        else:
            return "Applicant without profile"
class Job(models.Model):
    employer = models.ForeignKey(Employer, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = RichTextField()
    requirements = models.TextField()
    salary = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    JOB_TYPE_CHOICES = (
        ('full-time', 'Toàn thời gian'),
        ('part-time', 'Bán thời gian'),
        ('internship', 'Thực tập'),
    )
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)  # Thêm trường job_type

    def __str__(self):
        return self.title


class Application(models.Model):
    STATUS_CHOICES = (
        ('submitted', 'Đã nộp'),
        ('reviewing', 'Đang xét duyệt'),
        ('interviewed', 'Đã phỏng vấn'),
        ('hired', 'Đã tuyển dụng'),
        ('rejected', 'Từ chối'),
    )
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')

    def __str__(self):
        return f"{self.applicant} - {self.job}"





class Rating(models.Model):
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE)
    employer = models.ForeignKey(Employer, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)

    def __str__(self):
        return f"{self.applicant} đánh giá {self.employer}: {self.rating}"
