from rest_framework import serializers
from .models import User, Event, EventImage

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},  # passwordは出力しない
        }
        
    def create(self, validated_data):  # create（POST）メソッドの上書き：そのままだとハッシュ化されなかった
        password = validated_data.pop('password')  # パスワードを一旦抜き出す
        user = User(**validated_data)
        user.set_password(password)  # 🔒 ハッシュ化して保存
        user.save()
        return user

class UserDisplaySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields = ['id', 'image', 'order', 'uploaded_at']



class EventSerializer(serializers.ModelSerializer):
    images = EventImageSerializer(many=True, read_only=True)
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'share_token', 'owner']


# イベント概要をとってくる
class EventSummarySerializer(serializers.ModelSerializer):
    owner = UserDisplaySerializer(read_only = True)
    
    class Meta:
        model = Event
        fields = ["id", "owner", "title", "event_datetime"]
        

#ユーザに対して、related_nameで定義したデータもとってくるためのシリアライザー
#==========特徴：ユーザ情報とその人がもつイベントを合わせて取得できる=========
class UserEventsSerializer(serializers.ModelSerializer):
    events = EventSummarySerializer(many=True) #eventsは、モデルのrelated_nameで定義した
    class Meta:
        model = User
        fields = ["username" , "events"]













#=========emailでログインできるようにJWT認証を上書き===================
User = get_user_model()

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("username")  # ← 本当はemailを入力している
        password = attrs.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("メールアドレスが登録されていません")

        if not user.check_password(password):
            raise serializers.ValidationError("パスワードが間違っています")

        attrs["username"] = user.username  # JWTはusernameで認証するため
        return super().validate(attrs)




# class EventSerializer(serializers.ModelSerializer):
#     images = EventImageSerializer(many=True, read_only=True)
#     owner = serializers.ReadOnlyField(source='owner.username')
#     shared_with = serializers.SlugRelatedField(
#         many=True,
#         slug_field='username',
#         queryset=User.objects.all()
#     )

#     class Meta:
#         model = Event
#         fields = [
#             'id', 'owner', 'title', 'description', 'date',
#             'background_color', 'font_style', 'layout_style',
#             'end_message', 'shared_with', 'share_token',
#             'share_password', 'created_at', 'updated_at',
#             'images',
#         ]
#         read_only_fields = ['id', 'created_at', 'updated_at', 'share_token', 'owner', 'images']