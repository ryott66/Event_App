from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)


class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length = 200)
    description = models.TextField(blank = True)
    event_datetime = models.DateTimeField()
    background_color = models.CharField(max_length = 7, default = "#ffffff")
    font_style = models.CharField(max_length = 50, default = "serif")
    layout_style = models.CharField(max_length = 50, default = "simple")
    end_message = models.TextField(blank = True)

    shared_with = models.ManyToManyField(User, blank = True, related_name = 'shared_events')
    share_token = models.CharField(max_length = 100, unique = True, default = uuid.uuid4)
    share_password = models.CharField(max_length = 128, null = True, blank = True)

    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)

    def __str__(self):
        return self.title
    
    
class EventImage(models.Model):
    event = models.ForeignKey(Event, on_delete = models.CASCADE, related_name='images')
    image = models.ImageField(upload_to = 'event_images/')
    order = models.IntegerField(default = 0)
    uploaded_at = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return f"{self.event.title} - Image {self.order}"