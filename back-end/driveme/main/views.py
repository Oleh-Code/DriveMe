from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView, CreateAPIView, RetrieveUpdateAPIView, DestroyAPIView, RetrieveDestroyAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework import permissions
from rest_framework import status

from .serializer import CarsListSerializer, UserDetailSerializer, CarsDetailSerializer, RentedCarSerializer, CategorySerializer, PaymentSerialzier
from .models import Car, User, Rented_Car, Category, Payment, PaymentSys
import datetime

class CarAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        car = Car.objects.all()
        serializer = CarsListSerializer(car, many=True)
        return Response(serializer.data)

class UserAPIView(RetrieveUpdateAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'username'

    def get_queryset(self):
        return User.objects.filter(username=self.request.user.username)
    
    def put(self, request, *args, **kwargs):
        instance = self.request.user
        serializer = UserDetailSerializer(instance=instance, data=request.data)
        try: 
            payment = Payment.objects.get(number=request.data['payment_details']['number'])
        except:
            pass

        if serializer.is_valid():
            print('yes')
            try:
                serializer.save(payment_details=payment, is_active=True)
            except:
                serializer.save(is_active=True)
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CarRetrieveAPIView(RetrieveAPIView):
    serializer_class = CarsDetailSerializer
    queryset = Car.objects.all()
    lookup_field = 'slug'

class RentedCarAPIView(RetrieveDestroyAPIView, CreateModelMixin):
    serializer_class = RentedCarSerializer
    lookup_field = 'username'
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Rented_Car.objects.filter(username=self.request.user)
    
    def post(self, request, *args, **kwargs):
        serializer = RentedCarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(username=self.request.user, car_id=request.data['car'], payment_details_id=request.data['payment_details'])
        return Response(data=serializer.data ,status=201)

class CategoriesAPIView(APIView):
    permission_classes = [permissions.AllowAny,]

    def get(self, request):
        query = Category.objects.all()
        serializer = CategorySerializer(query, many=True)
        return Response(serializer.data)

class CreatePaymentAPIView(CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PaymentSerialzier

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        payment_sys = PaymentSys.objects.get(name=request.data['payment_sys'])
        if serializer.is_valid():
            serializer.save(payment_sys=payment_sys)
        return Response(data=serializer.data, status=201)

class DestroyPaymentAPIView(DestroyAPIView):
    serializer_class = PaymentSerialzier
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(pk=self.kwargs['pk'])