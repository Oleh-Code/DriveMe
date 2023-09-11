from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=120, blank=False, null=False, unique=True)
    password = models.CharField(max_length=120, blank=False, null=False)
    email = models.EmailField(blank=False, null=False)
    full_name = models.CharField(max_length=200, blank=False, null=False)
    date_of_birth = models.DateField(null=True, blank=True)
    photo = models.ImageField(upload_to='profiles', null=True, blank=True)
    registered_since = models.DateField(auto_now=True, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    payment_details = models.ForeignKey('Payment', on_delete=models.SET_NULL, null=True, blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['password', 'full_name', 'email']

    objects = CustomUserManager()

    def __str__(self):
        return self.full_name
    
    class Meta:
        verbose_name = 'Username'
        verbose_name_plural = 'Usernames'

class Car(models.Model):
    full_name = models.CharField(max_length=200, blank=False, null=False)
    category = models.ForeignKey('Category', on_delete=models.PROTECT)
    image = models.ImageField(upload_to='cars')
    short_desc = models.CharField(max_length=250)
    engine = models.IntegerField(default=None)
    speed = models.IntegerField(default=None)
    time_to_100 = models.FloatField(default=None)
    weight = models.FloatField(default=None)
    car_range = models.IntegerField(default=None)
    transmission = models.ForeignKey('Transmission', on_delete=models.PROTECT)
    drive_train = models.ForeignKey('Drive_train', on_delete=models.PROTECT)
    color = models.ForeignKey('Color', on_delete=models.PROTECT)
    price_per_day = models.IntegerField(default=None)
    shop_rating = models.FloatField(default=None)
    slug = models.SlugField(max_length=120, blank=False, null=False)

    def __str__(self):
        return self.full_name
    
    class Meta:
        verbose_name = 'Car'
        verbose_name_plural = 'Cars'

class Category(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

class Transmission(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Transmission'
        verbose_name_plural = 'Transmission'

class Drive_train(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120)

    def __str__(self):
        return self.name 
    
    class Meta:
        verbose_name = 'Drive Train'
        verbose_name_plural = 'Drive Train'

class Color(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Color'
        verbose_name_plural = 'Colors'

class Payment(models.Model):
    payment_sys = models.ForeignKey('PaymentSys', on_delete=models.PROTECT, null=True, blank=True)
    number = models.CharField(max_length=20)
    valid = models.CharField(max_length=5)
    cvv = models.IntegerField()

    def __str__(self):
        return self.number
    
    class Meta:
        verbose_name = 'Payment Detail'
        verbose_name_plural = 'Payment Details'

class PaymentSys(models.Model):
    name = models.CharField(max_length=15)
    slug = models.SlugField(max_length=20)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Payment System'
        verbose_name_plural = 'Payment Systems'

class Rented_Car(models.Model):
    car = models.ForeignKey('Car', on_delete=models.PROTECT, blank=True, null=True)
    username = models.ForeignKey('User', on_delete=models.PROTECT, default=None, blank=True, null=True)
    payment_details = models.ForeignKey('Payment', on_delete=models.PROTECT, default=None, blank=True, null=True)
    city = models.CharField(max_length=120, default=None)
    street = models.CharField(max_length=120, default=None)
    days = models.IntegerField()
    total = models.IntegerField(default=None)

    def __str__(self):
        return self.car.full_name
    
    class Meta:
        verbose_name = 'Rented Car'
        verbose_name_plural = 'Rented Cars'