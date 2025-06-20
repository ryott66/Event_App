from rest_framework import viewsets , generics
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User, Event
from .serializers import UserSerializer, UserDisplaySerializer, EventSerializer, UserEventsSerializer, EventSummarySerializer



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated], url_path=r"me")
    def me (self,request):
        serializer = UserDisplaySerializer(request.user)
        return Response(serializer.data)
    """
    リクエストは以下のようになってる
    GET /api/users/me/
    Authorization: Bearer <JWTアクセストークン>
    このAuthヘッダがあることで[IsAuthenticated]も、request.userも使える
    """


# 最強イベント操作ビュー
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer  
    
    def perform_create(self, serializer): #POST時の動作
        serializer.save(owner=self.request.user)  #ForeignKeyにはUserの「主キー」を渡す
        
    """Django REST Framework（DRF）の ModelViewSet のPOST処理はこう：
    リクエストを受けてserializer = Serializer(data=request.data) を作成し
    serializer.is_valid() を通して perform_create(serializer) を呼ぶ ←ここで保存される
    保存後、レスポンスが返る"""

    
# いったんつかわない  user/<pk>/events?  あるユーザのイベントを取得
class OnesEventsAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserEventsSerializer


# これでログインユーザのイベント取得
class MyEventListAPIView(generics.ListAPIView):
    serializer_class = EventSummarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(owner=self.request.user)











#=======JWT認証上書き=========================

from .serializers import EmailTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
    
    
    
#======リフレッシュトークン再発行して返すレスポンスをカスタム==============

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # 通常のアクセストークン取得
        response = super().post(request, *args, **kwargs)

        # 新しいリフレッシュトークンを発行（ブラックリスト機能に従って）
        old_refresh = request.data.get("refresh")
        try:
            new_refresh = str(RefreshToken(old_refresh))
        except Exception:
            new_refresh = None

        if response.status_code == 200 and new_refresh:
            response.data["refresh"] = new_refresh

        return response

