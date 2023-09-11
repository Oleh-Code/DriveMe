from django.urls import path
from .views import CarAPIView, UserAPIView, CarRetrieveAPIView, RentedCarAPIView, CategoriesAPIView, CreatePaymentAPIView, DestroyPaymentAPIView

urlpatterns = [
    path('', CarAPIView.as_view()),
    path('categories/', CategoriesAPIView.as_view()),
    path('car/<slug:slug>/', CarRetrieveAPIView.as_view()),
    path('user/<slug:username>/', UserAPIView.as_view()),
    path('rented-car/<int:username>/', RentedCarAPIView.as_view()),
    path('create-payment/', CreatePaymentAPIView.as_view()),
    path('delete-payment/<int:pk>/', DestroyPaymentAPIView.as_view())
]