from django.contrib import admin

from .models import Car, Category, Color, Transmission, Drive_train, Payment, PaymentSys, User, Rented_Car

admin.site.register(Color)
admin.site.register(Transmission)
admin.site.register(Drive_train)
admin.site.register(PaymentSys)

@admin.register(Rented_Car)
class RentedCarAdmin(admin.ModelAdmin):
    list_display = ['car', 'id','username', 'days', 'total']

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'full_name', 'email', 'registered_since']
    list_display_links = ['id', 'username', 'full_name']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'number']
    list_display_links = ['id', 'number']

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'category', 'price_per_day']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']