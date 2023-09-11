from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField


from .models import *

class CarsListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Car
        fields = ('id', 'full_name', 'category', 'color','image', 'price_per_day', 'shop_rating', 'slug')
        depth = 1

class CarsDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Car
        fields = '__all__'
        depth = 1

class UserDetailSerializer(serializers.ModelSerializer):
    photo = Base64ImageField(required=False)
    class Meta:
        model = User
        fields = '__all__'
        depth = 2


class RentedCarSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Rented_Car
        fields = ['id', 'car', 'username', 'payment_details', 'city', 'street', 'days', 'total']
        depth = 3

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'

class PaymentSerialzier(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = '__all__'
        depth = 1