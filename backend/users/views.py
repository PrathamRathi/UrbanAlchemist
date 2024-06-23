from django.shortcuts import render
from django.http import JsonResponse
from django.http import QueryDict
from rest_framework import viewsets
from django.views.decorators.csrf import csrf_exempt
from ML_models.analyze_in_request import requestPipeline
import json
from .models import *
from .serializers import *

@csrf_exempt
def post(request):
        if request.method == 'POST':
            data = json.loads(request.body.decode())
            objective = data.get('objective')
            overview = data.get('overview')
            subject = data.get('subject')
            students = Student.objects.all()
            grades = Grade.objects.all()
            grade_map = {}
            for grade in grades:
                if grade.student.uuid not in grade_map:
                    grade_map[grade.student.uuid] = [{'grade': grade.percentage, 'date': grade.date}]
                else:
                    grade_map[grade.student.uuid].append({'grade': grade.percentage, 'date': grade.date})
            response = {}
            for student in students:
                if student.disability != "None":
                    iep = IEP.objects.all().filter(student=student.uuid)[0]
                    text, status = requestPipeline(subject, objective, overview, iep.accommodation, 
                                                student.uuid, grade_map, student.standard, student.disability)
                    if not status:
                        if LessonPlan.objects.last() == None:
                            lp = LessonPlan(name="initial plan", objectives=objective, overview=overview, subject=subject, present_date="02/19/2023")
                            lp.save()
                        lpsa = LpsAccommodation(lesson_plan=LessonPlan.objects.last(), student=student, accommodation = text)
                        lpsa.save()
                    response[str(student.uuid)] = text         
            return JsonResponse(response)

class StudentView(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()

class LessonPlanView(viewsets.ModelViewSet):
    serializer_class = LessonPlanSerializer
    queryset = LessonPlan.objects.all()

class IepView(viewsets.ModelViewSet):
    serializer_class = IepSerializer
    queryset = IEP.objects.all()


class LpsaView(viewsets.ModelViewSet):
    serializer_class = LpsaccommodationSerializer
    queryset = LpsAccommodation.objects.all()

class GradeView(viewsets.ModelViewSet):
    serializer_class = GradeSerializer
    queryset = Grade.objects.all()
